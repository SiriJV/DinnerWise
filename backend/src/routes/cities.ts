import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const q = (req.query.q as string | undefined)?.toLowerCase();

  let sql = 'SELECT * FROM cities';
  const params: any[] = [];

  if (q) {
    sql += ' WHERE LOWER(name) LIKE ?';
    params.push(`${q}%`);
  }

  sql += ' ORDER BY id';

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta städer' });
  }
});

router.get('/region/:region', async (req, res) => {
  const region = req.params.region;

  try {
    const [rows] = await db.query(
      'SELECT * FROM cities WHERE region = ? ORDER BY name ASC',
      [region]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta städer för regionen' });
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
      FROM cities
      WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${term}%`, `% ${term}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Kunde inte söka städer' });
  }
});

export default router;