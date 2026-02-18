import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { q, type, limit = 10 } = req.query;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Sökparameter "q" saknas eller är ogiltig' });
  }

  const search = `%${q}%`;
  const maxLimit = Math.min(Number(limit), 50);

  try {
    if (!type || type === 'all') {
      const [events] = await db.query(
        `SELECT id, title, description, date, start_time, end_time, price
         FROM events
         WHERE title LIKE ? OR description LIKE ?
         ORDER BY date ASC
         LIMIT ?`,
        [search, search, maxLimit]
      );

      const [cities] = await db.query(
        `SELECT id, name, latitude, longitude
         FROM new_cities
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit]
      );

      const [restaurants] = await db.query(
        `SELECT id, name, city
         FROM tripadvisor_restaurants
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit]
      );

      const [users] = await db.query(
        `SELECT id, name, alias
        FROM users
        WHERE name LIKE ? OR alias LIKE ?
        ORDER BY name ASC
        LIMIT ?`,
        [search, search, maxLimit]
      );

      const [tags] = await db.query(
        `SELECT id, name
         FROM tags
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit]
      );

      const [categories] = await db.query(
        `SELECT id, name
         FROM categories
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
        [search, maxLimit]
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
          `SELECT id, title, description, date, start_time, end_time, price
           FROM events
           WHERE title LIKE ? OR description LIKE ?
           ORDER BY date ASC
           LIMIT ?`,
          [search, search, maxLimit]
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
          [search, maxLimit]
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
          [search, maxLimit]
        );
        return res.json({ type: 'restaurants', results: rows });
      }

      case 'users': {
        const [rows] = await db.query(
          `SELECT id, username, display_name
           FROM users
           WHERE username LIKE ? OR display_name LIKE ?
           ORDER BY username ASC
           LIMIT ?`,
          [search, search, maxLimit]
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
          [search, maxLimit]
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
          [search, maxLimit]
        );
        return res.json({ type: 'categories', results: rows });
      }

      default:
        return res.status(400).json({
          error: 'Ogiltig söktyp. Tillåtna värden: all, events, cities, restaurants, users, tags, categories',
        });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sökningen misslyckades' });
  }
});

export default router;