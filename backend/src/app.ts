import express from 'express';
import restaurantRoutes from './routes/restaurants.js';
import eventsRouter from './routes/events.js';
import categoriesRouter from './routes/categories.js';
import tagsRouter from './routes/tags.js';
import usersRouter from './routes/users.js';
import citiesRouter from './routes/cities.js';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5175',
  })
);

app.use(express.json());

// Health check and test routes (no database dependency)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/test', (_req, res) => {
  res.json({
    message: 'Test route works!',
    timestamp: new Date().toISOString(),
  });
});

// Database-dependent routes
app.use('/restaurants', restaurantRoutes);
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/users', usersRouter);
app.use('/cities', citiesRouter);

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
