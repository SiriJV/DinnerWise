import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [tags] = await db.query('SELECT * FROM tags ORDER BY id');
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta taggar' });
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
      FROM tags
      WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${term}%`, `% ${term}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Could not search tags' });
  }
});

export default router;