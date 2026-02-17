import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/restaurants', async (_req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM tripadvisor_restaurants`);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Fetch failed', details: err.message });
  }
});

export default router;