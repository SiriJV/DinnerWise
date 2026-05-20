import express from 'express';
import { db } from '../db.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = express.Router();

router.get('/restaurants', asyncHandler(async (_req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM tripadvisor_restaurants`);
    res.json(rows);
  } catch (err: any) {
    console.error('Tripadvisor fetch failed:', err);
    throw ApiError.internal('Hämtning misslyckades');
  }
}));

export default router;