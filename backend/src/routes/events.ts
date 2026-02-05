import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

function parseIds(param: any): number[] {
  if (!param) return [];
  if (Array.isArray(param)) return param.map(Number).filter(Boolean);
  return [Number(param)].filter(Boolean);
}

router.get('/', async (req, res) => {
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
      e.price,
      e.date,
      e.start_time,
      e.end_time,
      r.name AS restaurant_name,
      r.address AS restaurant_address,
      r.city AS restaurant_city
    FROM events e
    JOIN restaurants r ON e.restaurant_id = r.id
  `;

  if (tags.length > 0) {
    sql += `
      JOIN event_tags et ON e.id = et.event_id
    `;
  }

  sql += ` WHERE e.date >= CURDATE() `;

  const params: any[] = [];

  if (cities.length > 0) {
    sql += ` AND r.city IN (${cities.map(() => '?').join(',')}) `;
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
      else if (priceId === 2) priceConditions.push('e.price BETWEEN 50 AND 100');
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
        e.end_time,
        r.name AS restaurant_name,
        r.address AS restaurant_address,
        r.city AS restaurant_city
      FROM events e
      JOIN restaurants r ON e.restaurant_id = r.id
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