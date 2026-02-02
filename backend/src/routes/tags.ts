import { Router } from 'express';
import { db } from '../db.js';

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
    res.status(500).json({ error: 'Kunde inte söka taggar' });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (isNaN(categoryId)) {
    return res.status(400).json({ error: 'Ogiltigt categoryId' });
  }

  try {
    const [tags] = await db.query('SELECT * FROM tags WHERE category_id = ? ORDER BY name', [categoryId]);
    res.json(tags);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta taggar för kategori' });
  }
});

export default router;