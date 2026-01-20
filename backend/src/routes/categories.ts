import { Router } from 'express';
import { db } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta kategorier' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    const category = (rows as any[])[0];

    if (!category) {
      return res.status(404).json({ error: 'Kategori hittades inte' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte hämta kategori' });
  }
});

export default router;