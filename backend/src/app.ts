import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import restaurantRoutes from './routes/restaurants.js';
import eventsRouter from './routes/events.js';
import categoriesRouter from './routes/categories.js';
import tagsRouter from './routes/tags.js';
import searchRouter from './routes/search.js';
import usersRouter from './routes/users.js';
import citiesRouter from './routes/cities.js';
import tripadvisorRouter from './routes/tripadvisor.js';
import accountUsersRouter from './routes/accountUsers.js';
import accountUserReportsRouter from './routes/accountUserReports.js';
import adminRouter from './routes/admin.js';
import { resolveCurrentAccount } from './middleware/clerkAuth.js';
import { db } from './db.js';
import emailRouter from './routes/email.js';
import geminiRouter from './routes/gemini.js';
import cors from 'cors';

import dotenv from 'dotenv';
// important: load environment variables before any code that uses them
dotenv.config();

const app = express();

app.use(
  cors({
    origin: /^http:\/\/localhost:\d+$/,
    credentials: true,  // required for Clerk session cookies and authentication
  })
);

const hasSecretKey = !!process.env.CLERK_SECRET_KEY;
const hasPublishableKey = !!process.env.CLERK_PUBLISHABLE_KEY;
console.log('[Clerk Config] CLERK_SECRET_KEY present:', hasSecretKey);
console.log('[Clerk Config] CLERK_PUBLISHABLE_KEY present:', hasPublishableKey);

app.use(express.json());
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/users/:userId/report', async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ error: 'Ogiltigt användar-ID' });
  }
  const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : null;
  const normalizedReason = reason && reason.length > 0 ? reason : null;
  try {
    const [userLookup]: any[] = await db.query(
      'SELECT id, name FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    if (!Array.isArray(userLookup) || userLookup.length === 0) {
      return res.status(404).json({ error: 'Användaren hittades inte' });
    }
    await db.query(
      `CREATE TABLE IF NOT EXISTS user_reports (id INT AUTO_INCREMENT PRIMARY KEY, reported_user_id INT NOT NULL, reported_by_account_user_id INT NULL, reason TEXT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, INDEX idx_user_reports_reported_user (reported_user_id), INDEX idx_user_reports_reporter (reported_by_account_user_id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    );
    await db.query(
      `INSERT INTO user_reports (reported_account_user_id, reported_by_account_user_id, reason, created_at) VALUES (?, NULL, ?, NOW())`,
      [userId, normalizedReason]
    );
    return res.status(200).json({
      success: true,
      message: 'Användaren har rapporterats',
    });
  } catch (error: any) {
    console.error('Error reporting user:', error);
    return res.status(500).json({ error: 'Kunde inte rapportera användaren' });
  }
});

// important: @clerk/express requires both secret and publishable keys
if (hasSecretKey && hasPublishableKey) {
  console.log('[APP.TS] Clerk keys found, initializing clerkMiddleware()');
  try {
    app.use(clerkMiddleware());
    console.log('✓ Clerk middleware initialized');
  } catch (error) {
    console.error('⚠️  Failed to initialize Clerk middleware:', error);
    console.error('   Ensure CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY are correct in .env');
  }
} else {
  const missing = [];
  if (!hasSecretKey) missing.push('CLERK_SECRET_KEY');
  if (!hasPublishableKey) missing.push('CLERK_PUBLISHABLE_KEY');
  console.warn('⚠️  Clerk authentication middleware DISABLED (missing keys)');
  console.warn('   Missing: ' + missing.join(', '));
  console.warn('   Temporary test auth endpoints (/auth/account) will not work.');
  console.warn('   Add both keys to backend/.env to enable Clerk authentication.');
}

app.use(resolveCurrentAccount);
app.use('/auth/account', accountUsersRouter);
app.use('/account-users', accountUserReportsRouter);
app.use('/admin', adminRouter);

// Database-dependent routes
app.use('/api', tripadvisorRouter);
app.use('/restaurants', restaurantRoutes);
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/search', searchRouter);
app.use('/users', usersRouter);
app.use('/cities', citiesRouter);
app.use('/email', emailRouter);
app.use('/gemini', geminiRouter);

// Error handling middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res
    .status(500)
    .json({ error: 'Internal server error', message: err?.message });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
