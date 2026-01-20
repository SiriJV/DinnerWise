import { Router } from 'express';
import { db } from '../db';

const router = Router();

/**
 * GET /events
 * filtrera på: city_id, restaurant_id, category_id, price_lte, date
 * sortera efter: order=price or order=date (närmast i datum)
 */
router.get('/', async (req, res) => {
  const { city_id, restaurant_id, category_id, price_lte, date, order } = req.query;

  let sql = `
    SELECT e.*, 
      c.id AS category_id, 
      r.id AS restaurant_id, 
      r.city AS city_id
    FROM events e
    JOIN categories c ON e.category_id = c.id
    JOIN restaurants r ON e.restaurant_id = r.id
  `;

  const params: any[] = [];

  // visar bara event i framtiden
  sql += ` WHERE e.date >= CURDATE() `;

  // filtrera på stad, restaurang, kategori, pris och datum
  if (city_id) {
    sql += ` AND r.city = ? `;
    params.push(city_id);
  }

  if (restaurant_id) {
    sql += ` AND r.id = ? `;
    params.push(restaurant_id);
  }

  if (category_id) {
    sql += ` AND c.id = ? `;
    params.push(category_id);
  }

  if (price_lte) {
    sql += ` AND e.price <= ? `;
    params.push(price_lte);
  }

  if (date) {
    sql += ` AND e.date = ? `;
    params.push(date);
  }

  if (order === 'price') {
    sql += ` ORDER BY e.price ASC, e.date ASC `;
  } else if (order === 'availability') {
    sql += ` ORDER BY spots_left DESC, e.date ASC `;
  } else {
    sql += ` ORDER BY e.date ASC, e.start_time ASC `;
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta event' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  const term = q.toString().toLowerCase();

  const [rows] = await db.query(
    `
    SELECT *
    FROM events
    WHERE date >= CURDATE()
      AND (
        LOWER(title) LIKE ?
        OR LOWER(title) LIKE ?
      )
    ORDER BY date ASC, start_time ASC
    `,
    [`${term}%`, `% ${term}%`]
  );

  res.json(rows);
});

export default router;