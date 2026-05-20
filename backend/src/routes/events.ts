import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { getAuth, clerkClient } from '@clerk/express';
import * as accountService from '../services/accountUserService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

function parseIds(param: any): number[] {
  if (!param) return [];
  if (Array.isArray(param)) return param.map(Number).filter(Boolean);
  return [Number(param)].filter(Boolean);
}

router.get('/', asyncHandler(async (req, res) => {
  const {
    category_ids,
    restaurant_id,
    city_ids,
    price_ids,
    date,
    order,
    tag_ids,
  } = req.query;

  const categories = parseIds(category_ids);
  const cities = parseIds(city_ids);
  const tags = parseIds(tag_ids);
  const prices = parseIds(price_ids);

  let sql = `
    SELECT 
      DISTINCT e.id,
      e.title,
      e.description,
      e.category_id,
      e.restaurant_id,
      e.current_participants,
      e.max_participants,
      e.price,
      e.date,
      e.start_time,
      e.end_time,
      r.name AS restaurant_name,
      r.address_string AS restaurant_address,
      r.city AS restaurant_city
    FROM events e
    JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
    JOIN new_cities c ON r.city = c.name
  `;

  if (tags.length > 0) {
    sql += `
      JOIN event_tags et ON e.id = et.event_id
    `;
  }

  sql += ` WHERE e.date >= CURDATE() `;

  const params: any[] = [];

  if (cities.length > 0) {
    sql += ` AND c.id IN (${cities.map(() => '?').join(',')}) `;
    params.push(...cities);
  }

  if (categories.length > 0) {
    sql += ` AND e.category_id IN (${categories.map(() => '?').join(',')}) `;
    params.push(...categories);
  }

  if (restaurant_id) {
    sql += ` AND e.restaurant_id = ? `;
    params.push(restaurant_id);
  }

  if (prices.length > 0) {
    const priceConditions: string[] = [];
    prices.forEach((priceId) => {
      if (priceId === 1) priceConditions.push('e.price < 50');
      else if (priceId === 2)
        priceConditions.push('e.price BETWEEN 50 AND 100');
      else if (priceId === 3) priceConditions.push('e.price > 100');
    });
    if (priceConditions.length > 0) {
      sql += ` AND (${priceConditions.join(' OR ')}) `;
    }
  }

  if (date) {
    sql += ` AND e.date = ? `;
    params.push(date);
  }

  if (tags.length > 0) {
    sql += ` AND et.tag_id IN (${tags.map(() => '?').join(',')}) `;
    params.push(...tags);
  }

  if (order === 'price') {
    sql += ` ORDER BY e.price ASC, e.date ASC `;
  } else if (order === 'availability') {
    sql += ` ORDER BY e.current_participants ASC, e.date ASC `;
  } else {
    sql += ` ORDER BY e.date ASC, e.start_time ASC `;
  }

  const [rows] = await db.query(sql, params);
  res.json(rows);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest('Ogiltigt event-ID', { id });
  }

  const [rows] = await db.query(
    `
      SELECT 
        e.id,
        e.title,
        e.description,
        e.category_id,
        e.restaurant_id,
        e.current_participants,
        e.max_participants,
        e.price,
        e.date,
        e.start_time,
        e.end_time,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address,
        r.city AS restaurant_city
      FROM events e
      JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      WHERE e.id = ?
      `,
    [id],
  );

  const events = rows as any[];
  if (events.length === 0) {
    throw ApiError.notFound('Event hittades inte', { id });
  }

  res.json(events[0]);
}));

router.get('/:id/tags', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest('Ogiltigt event-ID', { id });
  }

  const [rows] = await db.query(
    `
      SELECT t.id, t.name, t.category_id
      FROM tags t
      JOIN event_tags et ON t.id = et.tag_id
      WHERE et.event_id = ?
      `,
    [id],
  );

  res.json(rows);
}));

/**
 * POST /events/:id/report
 * Report an event
 */
router.post('/:id/report', asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { reason } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest('Ogiltigt event-ID', { id });
  }

  let reporterId: number | null = null;

  try {
    const auth = getAuth(req);
    const clerkUserId = auth?.userId;

    if (clerkUserId) {
      let email = 'unknown@example.com';
      let firstName: string | undefined;
      let lastName: string | undefined;

      try {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        email = clerkUser.emailAddresses?.[0]?.emailAddress || email;
        firstName = clerkUser.firstName || undefined;
        lastName = clerkUser.lastName || undefined;
      } catch (err) {
        console.warn('Could not fetch Clerk user profile:', err);
      }

      const account = await accountService.findOrCreateLocalAccount(
        clerkUserId,
        email,
        firstName,
        lastName
      );

      reporterId = account?.id ?? null;
    }
  } catch (e) {
    console.warn('Failed to resolve reporter:', e);
    reporterId = null;
  }

  const [eventRows] = await db.query('SELECT id FROM events WHERE id = ?', [id]);
  if ((eventRows as any[]).length === 0) {
    throw ApiError.notFound('Eventet hittades inte', { id });
  }

  if (reporterId !== null) {
    const [existingReports] = await db.query(
      `SELECT id FROM event_reports 
         WHERE event_id = ? AND reported_by_account_user_id = ? AND status = 'open'`,
      [id, reporterId]
    );

    if ((existingReports as any[]).length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Du har redan rapporterat detta event',
        isDuplicate: true,
      });
    }
  }

  try {
    await db.execute(
      `INSERT INTO event_reports (event_id, reported_by_account_user_id, reason, status)
       VALUES (?, ?, ?, 'open')`,
      [id, reporterId, reason || null]
    );

    return res.status(200).json({
      success: true,
      message: 'Eventet har rapporterats',
      isDuplicate: false,
    });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(200).json({
        success: true,
        message: 'Du har redan rapporterat detta event',
        isDuplicate: true,
      });
    }
    throw err;
  }
}));

export default router;
