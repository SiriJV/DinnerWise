import { Router } from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { q, type, limit = 10 } = req.query;

  if (!q || typeof q !== 'string') {
    throw ApiError.badRequest('Sökparameter "q" saknas eller är ogiltig');
  }

  const search = `%${q}%`;
  const maxLimit = Math.min(Number(limit), 50);

  try {
    if (!type || type === 'all') {
      const [events] = await db.query(
        `SELECT 
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
WHERE e.title LIKE ? OR e.description LIKE ?
ORDER BY e.date ASC
LIMIT ?`,
        [search, search, maxLimit],
      );

      const [cities] = await db.query(
        `SELECT id, name, latitude, longitude
         FROM new_cities
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit],
      );

      const [restaurants] = await db.query(
        `SELECT id, name, city
         FROM tripadvisor_restaurants
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit],
      );

      const [users] = await db.query(
        `SELECT id, name, alias
        FROM users
        WHERE name LIKE ? OR alias LIKE ?
        ORDER BY name ASC
        LIMIT ?`,
        [search, search, maxLimit],
      );

      const [tags] = await db.query(
        `SELECT id, name
         FROM tags
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit],
      );

      const [categories] = await db.query(
        `SELECT id, name
         FROM categories
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit],
      );

      return res.json({
        type: 'all',
        results: {
          events,
          cities,
          restaurants,
          users,
          tags,
          categories,
        },
      });
    }

    switch (type) {
      case 'events': {
        const [rows] = await db.query(
          `SELECT 
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
WHERE e.title LIKE ? OR e.description LIKE ?
ORDER BY e.date ASC
LIMIT ?`,
          [search, search, maxLimit],
        );
        return res.json({ type: 'events', results: rows });
      }

      case 'cities': {
        const [rows] = await db.query(
          `SELECT id, name, latitude, longitude
           FROM new_cities
           WHERE name LIKE ?
           ORDER BY name ASC
           LIMIT ?`,
          [search, maxLimit],
        );
        return res.json({ type: 'cities', results: rows });
      }

      case 'restaurants': {
        const [rows] = await db.query(
          `SELECT id, name, city
           FROM tripadvisor_restaurants
           WHERE name LIKE ?
           ORDER BY name ASC
           LIMIT ?`,
          [search, maxLimit],
        );
        return res.json({ type: 'restaurants', results: rows });
      }

      case 'users': {
        const [rows] = await db.query(
          `SELECT id, name, alias
           FROM users
           WHERE name LIKE ? OR alias LIKE ?
           ORDER BY name ASC
           LIMIT ?`,
          [search, search, maxLimit],
        );
        return res.json({ type: 'users', results: rows });
      }

      case 'tags': {
        const [rows] = await db.query(
          `SELECT id, name
           FROM tags
           WHERE name LIKE ?
           ORDER BY name ASC
           LIMIT ?`,
          [search, maxLimit],
        );
        return res.json({ type: 'tags', results: rows });
      }

      case 'categories': {
        const [rows] = await db.query(
          `SELECT id, name
           FROM categories
           WHERE name LIKE ?
           ORDER BY name ASC
           LIMIT ?`,
          [search, maxLimit],
        );
        return res.json({ type: 'categories', results: rows });
      }

      default:
        throw ApiError.badRequest(
          'Ogiltig söktyp. Tillåtna värden: all, events, cities, restaurants, users, tags, categories'
        );
    }
}));

export default router;
