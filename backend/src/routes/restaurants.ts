import { Router } from 'express';
import { db } from '../db';

const router = Router();

/**
 * GET /restaurants
 * kan också köra: ?city=stockholm
 */
router.get('/', async (req, res) => {
  const city = req.query.city as string | undefined;

  let sql = `SELECT * FROM restaurants`;
  const params: any[] = [];

  if (city) {
    sql += ` WHERE LOWER(city) = LOWER(?)`;
    params.push(city);
  }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta restauranger' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
  return res.json([]);
  }

  const term = q.toString().toLowerCase();

  try {
    const [rows]: any[] = await db.query(
      `
      SELECT *
      FROM restaurants
      WHERE LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${term}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Kunde inte söka restauranger' });
  }
});

router.get('/:id/events', async (req, res) => {
  const restaurantId = Number(req.params.id);

  try {
    const [events] = await db.query(
      `
      SELECT *
      FROM events
      WHERE restaurant_id = ?
        AND (date > CURDATE() OR (date = CURDATE() AND start_time > CURTIME()))
      ORDER BY date ASC, start_time ASC
      `,
      [restaurantId]
    );

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta events' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [rows] = await db.query(`SELECT * FROM restaurants WHERE id = ?`, [id]);

    const restaurant = (rows as any[])[0];
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurang hittades inte' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta restaurang' });
  }
});

export default router;