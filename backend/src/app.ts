import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { clerkMiddleware } from '@clerk/express';
import restaurantRoutes from './modules/restaurants/routes/restaurants.routes.js';
import eventsRouter from './modules/events/routes/events.routes.js';
import categoriesRouter from './modules/categories/routes/categories.routes.js';
import tagsRouter from './modules/tags/routes/tags.routes.js';
import searchRouter from './modules/search/routes/search.routes.js';
import usersRouter from './modules/users/routes/users.routes.js';
import citiesRouter from './modules/cities/routes/cities.routes.js';
import tripadvisorRouter from './modules/tripadvisor/routes/tripadvisor.routes.js';
import accountUsersRouter from './modules/accountUsers/routes/accountUsers.routes.js';
import accountUserReportsRouter from './modules/accountUserReports/routes/accountUserReports.routes.js';
import adminRouter from './modules/admin/routes/admin.routes.js';
import { resolveCurrentAccount } from './middleware/clerkAuth.js';
import emailRouter from './modules/email/routes/email.routes.js';
import geminiRouter from './modules/gemini/routes/gemini.routes.js';
import cors from 'cors';
import { env } from './config/env.js';
import { ApiError } from './utils/ApiError.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const API_BASE = '/api/v1';

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
  servers: [{ url: `${env.api.publicUrl}${API_BASE}` }],
};

app.get('/api/openapi.json', (_req, res) => {
  res.json(openApiDocWithServer);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocWithServer));
console.log('[APP] Swagger docs available at /api/docs');

app.get(`${API_BASE}/health`, (_req, res) => {
  res.json({
    success: true,
    data: { status: 'ok', timestamp: new Date().toISOString() },
  });
});


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
app.use(`${API_BASE}/auth/account`, accountUsersRouter);
app.use(`${API_BASE}/user-reports`, accountUserReportsRouter);
app.use(`${API_BASE}/admin`, adminRouter);

// Database-dependent routes
app.use(`${API_BASE}/tripadvisor`, tripadvisorRouter);
app.use(`${API_BASE}/restaurants`, restaurantRoutes);
app.use(`${API_BASE}/events`, eventsRouter);
app.use(`${API_BASE}/categories`, categoriesRouter);
app.use(`${API_BASE}/tags`, tagsRouter);
app.use(`${API_BASE}/search`, searchRouter);
app.use(`${API_BASE}/users`, usersRouter);
app.use(`${API_BASE}/cities`, citiesRouter);
app.use(`${API_BASE}/email`, emailRouter);
app.use(`${API_BASE}/gemini`, geminiRouter);

// 404 handler
app.use((_req, _res, next) => {
  next(ApiError.notFound('Route hittades inte'));
});

app.use(errorHandler);

export default app;
