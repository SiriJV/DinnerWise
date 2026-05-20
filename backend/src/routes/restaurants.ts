import { Router } from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

/**
 * GET /restaurants
 * kan också köra: ?city=stockholm
 */
router.get('/', asyncHandler(async (req, res) => {
  const city = req.query.city as string | undefined;

  let sql = `SELECT * FROM tripadvisor_restaurants`;
  const params: any[] = [];

  if (city) {
    sql += ` WHERE LOWER(city) = LOWER(?)`;
    params.push(city);
  }

  const [rows] = await db.query(sql, params);
  res.json(rows);
}));

router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  const term = q.toString().toLowerCase();

  const [rows]: any[] = await db.query(
    `
      SELECT *
      FROM tripadvisor_restaurants
      WHERE LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
    [`${term}%`],
  );

  res.json(rows);
}));

router.get('/:id/events', asyncHandler(async (req, res) => {
  const restaurantId = Number(req.params.id);
  if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
    throw ApiError.badRequest('Ogiltigt restaurang-ID', { restaurantId });
  }

  const [events] = await db.query(
    `
      SELECT 
        e.id,
        e.title,
        e.description,
        e.category_id,
        e.restaurant_id,
        e.current_participants,
        e.price,
        e.date,
        e.start_time,
        e.end_time,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address
      FROM events e
      JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      WHERE e.restaurant_id = ?
        AND (e.date > CURDATE() OR (e.date = CURDATE() AND e.start_time > CURTIME()))
      ORDER BY e.date ASC, e.start_time ASC
      `,
    [restaurantId],
  );

  res.json(events);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest('Ogiltigt restaurang-ID', { id });
  }

  const [rows] = await db.query(`SELECT * FROM tripadvisor_restaurants WHERE id = ?`, [
    id,
  ]);

  const restaurant = (rows as any[])[0];
  if (!restaurant) {
    throw ApiError.notFound('Restaurang hittades inte', { id });
  }

  res.json(restaurant);
}));

export default router;