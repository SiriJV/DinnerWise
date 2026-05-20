import { Router } from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

router.get('/', asyncHandler(async (_req, res) => {
  const [users] = await db.query(`
      SELECT id, name, alias, bio, profile_picture_url, banner_picture_url
      FROM users
      ORDER BY id
    `);
  res.json(users);
}));

router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  const term = q.toString().toLowerCase() + '%';

  const [rows]: any[] = await db.query(
    `
      SELECT *
      FROM users
      WHERE LOWER(name) LIKE ?
         OR LOWER(name) LIKE ?
         OR LOWER(alias) LIKE ?
      ORDER BY name ASC
      `,
    [term, `% ${term}`, term],
  );

  res.json(rows);
}));

router.get('/alias/:alias', asyncHandler(async (req, res) => {
  const alias = req.params.alias;

  const [[user]]: any = await db.query(
    'SELECT id, name, alias, bio, profile_picture_url, banner_picture_url FROM users WHERE alias = ?',
    [alias],
  );

  if (!user) {
    throw ApiError.notFound('Användare hittades inte', { alias });
  }

  res.json(user);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw ApiError.badRequest('Ogiltigt användar-ID', { userId });
  }

  const [[user]]: any = await db.query(
    'SELECT id, name, alias, bio, profile_picture_url, banner_picture_url FROM users WHERE id = ?',
    [userId],
  );

  if (!user) {
    throw ApiError.notFound('Användare hittades inte', { userId });
  }

  res.json(user);
}));

export default router;