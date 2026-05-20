import { Router } from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const [tags] = await db.query('SELECT * FROM tags ORDER BY id');
  res.json(tags);
}));

router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  const term = q.toString().toLowerCase();

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
}));

router.get('/category/:categoryId', asyncHandler(async (req, res) => {
  const categoryId = Number(req.params.categoryId);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw ApiError.badRequest('Ogiltigt kategori-ID', { categoryId });
  }

  const [tags] = await db.query('SELECT * FROM tags WHERE category_id = ? ORDER BY name', [categoryId]);
  res.json(tags);
}));

export default router;