import { Router, Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import * as accountService from '../services/accountUserService.js';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

/**
 * Returns the local account if the caller is an authenticated admin, or null if not.
 */
async function resolveAdmin(req: Request): Promise<any> {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    throw ApiError.unauthorized('Inte inloggad');
  }

  let email = 'unknown@example.com';
  let firstName: string | undefined;
  let lastName: string | undefined;
  let invitedRole: string | undefined;

  try {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    email = clerkUser.emailAddresses?.[0]?.emailAddress || email;
    firstName = clerkUser.firstName || undefined;
    lastName = clerkUser.lastName || undefined;
    invitedRole = (clerkUser.publicMetadata as any)?.invitedRole as string | undefined;
  } catch (err) {
    console.warn('Could not fetch Clerk user profile:', err);
  }

  const account = await accountService.findOrCreateLocalAccount(
    clerkUserId,
    email,
    firstName,
    lastName,
    invitedRole
  );

  if (!account) {
    throw ApiError.unauthorized('Inte inloggad');
  }

  if (account.role !== 'admin') {
    throw ApiError.forbidden('Du har inte behörighet');
  }
  return account;
}

router.get('/users', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const users = await accountService.getAllAccounts();
  return res.json(users);
}));

/**
 * DELETE /admin/users/:userId
 * Deletes a local account user (and tries to delete Clerk user) (admin only)
 */
router.delete('/users/:userId', asyncHandler(async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req);

  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw ApiError.badRequest('Ogiltigt användar-ID', { userId });
  }

  if (userId === admin.id) {
    throw ApiError.forbidden('Du kan inte ta bort dig själv');
  }

  let connection: any;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows]: any[] = await connection.query(
      `SELECT id, clerk_user_id, email FROM account_users WHERE id = ? LIMIT 1`,
      [userId]
    );

    const targetUser = Array.isArray(rows) ? rows[0] : null;
    if (!targetUser) {
      await connection.rollback();
      throw ApiError.notFound('Användaren hittades inte', { userId });
    }

    await connection.query(
      `DELETE FROM user_reports WHERE reported_by_account_user_id = ?`,
      [userId]
    );

    const [deletedUsers]: any[] = await connection.query(
      `DELETE FROM account_users WHERE id = ?`,
      [userId]
    );

    const deletedRows = deletedUsers?.affectedRows ?? 0;
    if (deletedRows === 0) {
      await connection.rollback();
      throw ApiError.notFound('Användaren hittades inte', { userId });
    }

    await connection.commit();

    if (targetUser.clerk_user_id) {
      try {
        await clerkClient.users.deleteUser(targetUser.clerk_user_id);
      } catch (clerkError) {
        console.warn('Unable to delete Clerk user:', clerkError);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Användaren har tagits bort',
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Kunde inte ta bort användaren');
  } finally {
    connection?.release?.();
  }
}));

/**
 * GET /admin/events
 * Returns all events from the database
 */
router.get('/events', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const [rows]: any[] = await db.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.date,
        e.start_time,
        e.end_time,
        e.price,
        e.current_participants,
        e.max_participants,
        e.restaurant_id,
        r.name AS restaurant_name,
        e.category_id,
        c.name AS category_name
      FROM events e
      LEFT JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      LEFT JOIN categories c ON e.category_id = c.id
      ORDER BY e.id DESC
    `);
  return res.json(rows);
}));

/**
 * GET /admin/events/:eventId
 * Returns full details for a single event
 */
router.get('/events/:eventId', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const eventId = Number(req.params.eventId);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw ApiError.badRequest('Ogiltigt event-ID', { eventId });
  }

  const [rows]: any[] = await db.query(
    `
      SELECT
        e.id,
        e.title,
        e.description,
        e.date,
        e.start_time,
        e.end_time,
        e.price,
        e.current_participants,
        e.max_participants,
        e.restaurant_id,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address,
        r.city AS restaurant_city,
        e.category_id,
        c.name AS category_name
      FROM events e
      LEFT JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
      LIMIT 1
      `,
    [eventId]
  );

  const event = Array.isArray(rows) ? rows[0] : null;
  if (!event) {
    throw ApiError.notFound('Eventet hittades inte', { eventId });
  }

  return res.status(200).json(event);
}));

/**
 * DELETE /admin/events/:eventId
 * Deletes an event and related moderation rows
 */
router.delete('/events/:eventId', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const eventId = Number(req.params.eventId);
  if (!Number.isInteger(eventId) || eventId <= 0) {
    throw ApiError.badRequest('Ogiltigt event-ID', { eventId });
  }

  let connection: any;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [eventRows]: any[] = await connection.query(
      `SELECT id, title FROM events WHERE id = ? LIMIT 1`,
      [eventId]
    );

    if (!Array.isArray(eventRows) || eventRows.length === 0) {
      await connection.rollback();
      throw ApiError.notFound('Eventet hittades inte', { eventId });
    }

    await connection.query(
      `DELETE FROM event_reports WHERE event_id = ?`,
      [eventId]
    );

    await connection.query(
      `DELETE FROM event_tags WHERE event_id = ?`,
      [eventId]
    );

    await connection.query(
      `DELETE FROM events WHERE id = ?`,
      [eventId]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Eventet har tagits bort',
    });
  } catch (error: any) {
    if (connection) {
      await connection.rollback();
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.internal('Kunde inte ta bort eventet');
  } finally {
    connection?.release?.();
  }
}));

/**
 * DELETE /admin/event-reports/:reportId
 * Dismisses a report without deleting the event
 */
router.delete('/event-reports/:reportId', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const reportId = Number(req.params.reportId);
  if (!Number.isInteger(reportId) || reportId <= 0) {
    throw ApiError.badRequest('Ogiltigt rapport-ID', { reportId });
  }

  const [result]: any[] = await db.query(
    `DELETE FROM event_reports WHERE id = ?`,
    [reportId]
  );

  const deletedRows = result?.affectedRows ?? 0;

  if (deletedRows === 0) {
    throw ApiError.notFound('Rapporten hittades inte', { reportId });
  }

  return res.status(200).json({
    success: true,
    message: 'Rapporten har avfärdats',
  });
}));

/**
 * GET /admin/reported-users
 * Returns all reported users from the user_reports table
 * Joins with users table (legacy demo users) to get user details
 */
router.get('/reported-users', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  try {
    const [rows]: any[] = await db.query(`
      SELECT
        ur.id AS report_id,
        ur.reported_account_user_id,
        ur.reported_by_account_user_id,
        ur.reason,
        ur.created_at,
        u.name AS reported_user_email,
        u.alias AS reported_user_alias,
        NULL AS reported_user_first_name,
        NULL AS reported_user_last_name,
        NULL AS reported_user_role,
        NULL AS reported_user_clerk_user_id,
        reporter.email AS reporter_email
      FROM user_reports ur
      JOIN users u ON ur.reported_account_user_id = u.id
      LEFT JOIN account_users reporter ON ur.reported_by_account_user_id = reporter.id
      ORDER BY ur.created_at DESC
    `);

    const reports = Array.isArray(rows) ? rows : [];
    return res.status(200).json(reports);
  } catch (error: any) {
    if (error?.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([]);
    }
    throw ApiError.internal('Kunde inte hämta rapporterade användare');
  }
}));

/**
 * DELETE /admin/user-reports/:reportId
 * Dismisses a user report without deleting the user
 */
router.delete('/user-reports/:reportId', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const reportId = Number(req.params.reportId);
  if (!Number.isInteger(reportId) || reportId <= 0) {
    throw ApiError.badRequest('Ogiltigt rapport-ID', { reportId });
  }

  const [result]: any[] = await db.query(
    `DELETE FROM user_reports WHERE id = ?`,
    [reportId]
  );

  const deletedRows = result?.affectedRows ?? 0;

  if (deletedRows === 0) {
    throw ApiError.notFound('Rapporten hittades inte', { reportId });
  }

  return res.status(200).json({
    success: true,
    message: 'Rapporten har avfärdats',
  });
}));

/**
 * POST /admin/invitations
 * Send a Clerk invitation to a new admin email address.
 */
router.post('/invitations', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  const { emailAddress } = req.body;

  if (!emailAddress || typeof emailAddress !== 'string') {
    throw ApiError.badRequest('E-postadress krävs');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    throw ApiError.badRequest('Ogiltig e-postadress');
  }

  try {
    const redirectUrl = 'http://localhost:5173/accept-invitation';

    const invitation = await clerkClient.invitations.createInvitation({
      emailAddress,
      redirectUrl,
      publicMetadata: {
        invitedRole: 'admin',
      },
      notify: true,
    });

    return res.json({
      success: true,
      message: `Inbjudan skickad till ${emailAddress}`,
      invitation: {
        id: invitation.id,
        email: emailAddress,
        status: invitation.status,
      },
    });
  } catch (error: any) {
    if (error?.errors) {
      const clerkErrors = error.errors;
      for (const e of clerkErrors) {
        if (e.code === 'duplicate_record' || e.message?.includes('already')) {
          throw ApiError.conflict(
            'En inbjudan har redan skickats till denna e-postadress, eller så finns användaren redan'
          );
        }
      }
    }

    if (error?.message?.includes('already')) {
      throw ApiError.conflict(
        'En inbjudan har redan skickats till denna e-postadress, eller så finns användaren redan'
      );
    }

    throw ApiError.internal('Kunde inte skicka inbjudan');
  }
}));

/**
 * GET /admin/reported-events
 * Returns all reported events
 * Joins event_reports, events, and account_users to provide full context
 */
router.get('/reported-events', asyncHandler(async (req: Request, res: Response) => {
  await resolveAdmin(req);

  try {
    const [rows]: any[] = await db.query(`
      SELECT
        er.id AS report_id,
        er.event_id,
        er.reported_by_account_user_id,
        er.reason,
        er.status,
        er.created_at,
        e.title AS event_title,
        e.date AS event_date,
        e.start_time AS event_start_time,
        e.end_time AS event_end_time,
        e.description AS event_description,
        e.price AS event_price,
        e.current_participants AS event_current_participants,
        e.max_participants AS event_max_participants,
        e.restaurant_id,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address,
        r.city AS restaurant_city,
        e.category_id,
        c.name AS category_name,
        au.email AS reporter_email,
        au.first_name AS reporter_first_name,
        au.last_name AS reporter_last_name
      FROM event_reports er
      JOIN events e ON er.event_id = e.id
      LEFT JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN account_users au ON er.reported_by_account_user_id = au.id
      ORDER BY er.created_at DESC
    `);

    const reports = Array.isArray(rows) ? rows : [];
    return res.status(200).json(reports);
  } catch (err: any) {
    if (err?.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json([]);
    }

    throw ApiError.internal('Kunde inte hämta rapporterade events');
  }
}));

export default router;