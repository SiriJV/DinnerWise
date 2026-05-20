import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
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
import { env } from './config/env.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { ApiError } from './utils/ApiError.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ============================================================================
// CORS Configuration
// ============================================================================
// In development, allow localhost on any port
// In production, allow only the configured frontend URL
const corsOptions = {
  origin: env.node.isDev
    ? /^http:\/\/localhost:\d+$/  // Dev: localhost on any port
    : new RegExp(`^${env.frontend.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), // Prod: exact match
  credentials: true, // Required for Clerk session cookies
};

app.use(cors(corsOptions));

// ============================================================================
// Authentication Setup
// ============================================================================
const hasSecretKey = !!env.clerk.secretKey;
const hasPublishableKey = !!env.clerk.publishableKey;

console.log('[APP] Clerk Configuration:');
console.log(`  Secret Key: ${hasSecretKey ? '✓' : '✗'}`);
console.log(`  Publishable Key: ${hasPublishableKey ? '✓' : '✗'}`);

app.use(express.json());

const openApiPath = path.resolve(process.cwd(), 'openapi.yaml');
const openApiDoc = yaml.parse(fs.readFileSync(openApiPath, 'utf8'));
const openApiDocWithServer = {
  ...openApiDoc,
  servers: [{ url: env.api.publicUrl }],
};

app.get('/api/openapi.json', (_req, res) => {
  res.json(openApiDocWithServer);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocWithServer));
console.log('[APP] Swagger docs available at /api/docs');

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post(
  '/users/:userId/report',
  asyncHandler(async (req, res) => {
    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw ApiError.badRequest('Ogiltigt användar-ID', { userId });
    }

    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : null;
    const normalizedReason = reason && reason.length > 0 ? reason : null;

    const [userLookup]: any[] = await db.query(
      'SELECT id, name FROM users WHERE id = ? LIMIT 1',
      [userId]
    );
    if (!Array.isArray(userLookup) || userLookup.length === 0) {
      throw ApiError.notFound('Användaren hittades inte', { userId });
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
  })
);

// Important: @clerk/express requires both secret and publishable keys
if (hasSecretKey && hasPublishableKey) {
  console.log('[APP] Initializing Clerk middleware...');
  try {
    app.use(clerkMiddleware());
    console.log('[APP] ✓ Clerk middleware initialized');
  } catch (error) {
    console.error('[APP] ✗ Failed to initialize Clerk middleware:', error);
    console.error('     Ensure CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY are correct in .env');
  }
} else {
  const missing = [];
  if (!hasSecretKey) missing.push('CLERK_SECRET_KEY');
  if (!hasPublishableKey) missing.push('CLERK_PUBLISHABLE_KEY');
  console.warn('[APP] ⚠️  Clerk authentication DISABLED (missing keys)');
  console.warn(`     Missing: ${missing.join(', ')}`);
  console.warn('     Add both keys to backend/.env to enable Clerk authentication');
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

// 404 handler
app.use((_req, _res, next) => {
  next(ApiError.notFound('Route hittades inte'));
});

app.use(errorHandler);

export default app;
