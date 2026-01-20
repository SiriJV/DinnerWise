import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, alias, bio, profile_picture_url
      FROM users
      ORDER BY id
    `);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta users' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  const term = q.toString().toLowerCase() + '%';

  try {
    const [rows]: any[] = await db.query(
      `
      SELECT *
      FROM users
      WHERE LOWER(name) LIKE ?
         OR LOWER(name) LIKE ?
         OR LOWER(alias) LIKE ?
      ORDER BY name ASC
      `,
      [term, `% ${term}`, term]
    );

    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Could not search users' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = Number(req.params.id);

  try {
    const [[user]]: any = await db.query(
      'SELECT id, name, alias, bio, profile_picture_url FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User hittades inte' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte hämta user' });
  }
});

export default router;