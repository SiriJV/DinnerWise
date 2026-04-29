import { Router, Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import * as accountService from '../services/accountUserService.js';
import { db } from '../db.js';

const router = Router();

/**
 * Returns the local account if the caller is an authenticated admin, or null if not.
 */
async function resolveAdmin(req: Request, res: Response): Promise<any | null> {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    res.status(401).json({ error: 'Inte inloggad' });
    return null;
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
    res.status(401).json({ error: 'Inte inloggad' });
    return null;
  }

  if (account.role !== 'admin') {
    res.status(403).json({ error: 'Du har inte behörighet' });
    return null;
  }
  return account;
}

router.get('/users', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  try {
    const users = await accountService.getAllAccounts();
    return res.json(users);
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return res.status(500).json({ error: 'Kunde inte hämta data' });
  }
});

/**
 * DELETE /admin/users/:userId
 * Deletes a local account user (and tries to delete Clerk user) (admin only)
 */
router.delete('/users/:userId', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Ogiltigt användar-ID' });
  }

  if (userId === admin.id) {
    return res.status(403).json({ error: 'Du kan inte ta bort dig själv' });
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
      return res.status(404).json({ error: 'Användaren hittades inte' });
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
      return res.status(404).json({ error: 'Användaren hittades inte' });
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
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Kunde inte ta bort användaren' });
  } finally {
    connection?.release?.();
  }
});

/**
 * GET /admin/events
 * Returns all events from the database
 */
router.get('/events', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  try {
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
  } catch (error: any) {
    console.error('Error fetching admin events:', error);
    return res.status(500).json({ error: 'Kunde inte hämta data' });
  }
});

/**
 * GET /admin/events/:eventId
 * Returns full details for a single event
 */
router.get('/events/:eventId', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  const { eventId } = req.params;

  try {
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
      return res.status(404).json({ error: 'Eventet hittades inte' });
    }

    return res.status(200).json(event);
  } catch (error: any) {
    console.error('Error fetching event details:', error);
    return res.status(500).json({ error: 'Kunde inte hämta eventet' });
  }
});

/**
 * DELETE /admin/events/:eventId
 * Deletes an event and related moderation rows
 */
router.delete('/events/:eventId', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  const { eventId } = req.params;

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
      return res.status(404).json({ error: 'Eventet hittades inte' });
    }

    const event = eventRows[0];

    const [deletedReports]: any[] = await connection.query(
      `DELETE FROM event_reports WHERE event_id = ?`,
      [eventId]
    );

    const [deletedTags]: any[] = await connection.query(
      `DELETE FROM event_tags WHERE event_id = ?`,
      [eventId]
    );

    const [deletedEvents]: any[] = await connection.query(
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
    console.error('Error deleting event:', error);
    return res.status(500).json({ error: 'Kunde inte ta bort eventet' });
  } finally {
    connection?.release?.();
  }
});

/**
 * DELETE /admin/event-reports/:reportId
 * Dismisses a report without deleting the event
 */
router.delete('/event-reports/:reportId', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  const { reportId } = req.params;

  try {
    const [result]: any[] = await db.query(
      `DELETE FROM event_reports WHERE id = ?`,
      [reportId]
    );

    const deletedRows = result?.affectedRows ?? 0;

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Rapporten hittades inte' });
    }

    return res.status(200).json({
      success: true,
      message: 'Rapporten har avfärdats',
    });
  } catch (error: any) {
    console.error('Error dismissing event report:', error);
    return res.status(500).json({ error: 'Kunde inte avfärda rapporten' });
  }
});

/**
 * GET /admin/reported-users
 * Returns all reported users from the user_reports table
 * Joins with users table (legacy demo users) to get user details
 */
router.get('/reported-users', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

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
    console.error('Error fetching reported users:', error);
    return res.status(500).json({ error: 'Kunde inte hämta rapporterade användare' });
  }
});

/**
 * DELETE /admin/user-reports/:reportId
 * Dismisses a user report without deleting the user
 */
router.delete('/user-reports/:reportId', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  const reportId = Number(req.params.reportId);
  if (!Number.isInteger(reportId) || reportId <= 0) {
    return res.status(400).json({ error: 'Ogiltigt rapport-ID' });
  }

  try {
    const [result]: any[] = await db.query(
      `DELETE FROM user_reports WHERE id = ?`,
      [reportId]
    );

    const deletedRows = result?.affectedRows ?? 0;

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Rapporten hittades inte' });
    }

    return res.status(200).json({
      success: true,
      message: 'Rapporten har avfärdats',
    });
  } catch (error) {
    console.error('Error dismissing user report:', error);
    return res.status(500).json({ error: 'Kunde inte avfärda rapporten' });
  }
});

/**
 * POST /admin/invitations
 * Send a Clerk invitation to a new admin email address.
 */
router.post('/invitations', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

  const { emailAddress } = req.body;

  if (!emailAddress || typeof emailAddress !== 'string') {
    return res.status(400).json({ error: 'E-postadress krävs' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    return res.status(400).json({ error: 'Ogiltig e-postadress' });
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
    console.error('[admin/invitations] ✗ Error:', error.message);

    if (error?.errors) {
      const clerkErrors = error.errors;
      for (const e of clerkErrors) {
        if (e.code === 'duplicate_record' || e.message?.includes('already')) {
          return res.status(409).json({
            error: 'En inbjudan har redan skickats till denna e-postadress, eller så finns användaren redan',
          });
        }
      }
    }

    if (error.message?.includes('already')) {
      return res.status(409).json({
        error: 'En inbjudan har redan skickats till denna e-postadress, eller så finns användaren redan',
      });
    }

    return res.status(500).json({ error: 'Kunde inte skicka inbjudan' });
  }
});

/**
 * GET /admin/reported-events
 * Returns all reported events
 * Joins event_reports, events, and account_users to provide full context
 */
router.get('/reported-events', async (req: Request, res: Response) => {
  const admin = await resolveAdmin(req, res);
  if (!admin) return;

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

    console.error('[admin/reported-events] Error:', err);
    return res.status(500).json({ error: 'Kunde inte hämta rapporterade events' });
  }
});

export default router;