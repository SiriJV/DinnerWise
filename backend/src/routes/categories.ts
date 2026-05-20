import { Router } from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
  res.json(categories);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest('Ogiltigt kategori-ID', { id });
  }

  const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
  const category = (rows as any[])[0];

  if (!category) {
    throw ApiError.notFound('Kategori hittades inte', { id });
  }

  res.json(category);
}));

export default router;
