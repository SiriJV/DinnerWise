import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category_id, restaurant_id, city_id, price_lte, date, order } =
    req.query;

  let sql = `
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
      e.end_time
    FROM events e
    JOIN restaurants r ON e.restaurant_id = r.id
    WHERE e.date >= CURDATE()
  `;

  const params: any[] = [];

  if (city_id) {
    sql += ` AND r.city = ? `;
    params.push(city_id);
  }

  if (category_id) {
    sql += ` AND e.category_id = ? `;
    params.push(category_id);
  }

  if (restaurant_id) {
    sql += ` AND e.restaurant_id = ? `;
    params.push(restaurant_id);
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
    sql += ` ORDER BY e.current_participants ASC, e.date ASC `;
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
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
        e.end_time
      FROM events e
      WHERE e.id = ?
      `,
      [id],
    );

    const events = rows as any[];
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event hittades inte' });
    }

    res.json(events[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta event' });
  }
});

export default router;