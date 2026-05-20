import { Router } from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const q = (req.query.q as string | undefined)?.toLowerCase();

  let sql = 'SELECT * FROM new_cities';
  const params: any[] = [];

  if (q) {
    sql += ' WHERE LOWER(name) LIKE ?';
    params.push(`${q}%`);
  }

  sql += ' ORDER BY id';

  const [rows] = await db.query(sql, params);
  res.json(rows);
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
      FROM new_cities
      WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
    [`${term}%`, `% ${term}%`]
  );

  res.json(rows);
}));

export default router;
