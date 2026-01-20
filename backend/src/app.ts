import express from 'express';
import restaurantRoutes from '../src/routes/restaurants';
import eventsRouter from '../src/routes/events';
import categoriesRouter from '../src/routes/categories';
import tagsRouter from '../src/routes/tags';
import usersRouter from '../src/routes/users';
import citiesRouter from '../src/routes/cities';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:5175',
}));

app.use(express.json());

app.use('/restaurants', restaurantRoutes);
app.use('/events', eventsRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/users', usersRouter);
app.use('/cities', citiesRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;