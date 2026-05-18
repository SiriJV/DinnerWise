# DinnerWise

An app by [@SiriJV](https://github.com/SiriJV) and [@jessicaagren](https://github.com/jessicaagren).

## Project Overview

**DinnerWise** is a web application designed to help users discover, create, and participate in local dining events. The platform allows users to browse, join and/or schedule events at local restaurants. DinnerWise is intended for individuals seeking to meet new people, explore interests, and enjoy good food in a social setting.

## Tech Stack

**Frontend:**

- React
- TypeScript
- Mantine UI
- Sass
- React Router
- Vite

**Backend:**

- Node.js
- Express
- TypeScript
- MySQL
- Tripadvisor API
- Resend
- Gemini API

## Deployment

- Frontend: Vercel
- Backend: Railway
- Staging: Not set up yet (planned)

## Prerequisites

- Node.js 18+ (with npm)
- MySQL 8.0+
- Clerk account (for authentication)

## Getting Started

### 1. Install Dependencies

Frontend (root):

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

### 2. Setup Environment Variables (Backend)

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```
# Database (dev + prod)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=dinnerwise

# Clerk Authentication (dev + prod)
CLERK_SECRET_KEY=your_key_here
CLERK_PUBLISHABLE_KEY=your_key_here

# Server
PORT=3001
NODE_ENV=development # dev: development, prod: production

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173 # dev frontend URL
API_PUBLIC_URL=http://localhost:3001 # dev API URL

# External services (optional)
# TRIPADVISOR_API_KEY=your_key_here
# GOOGLE_GENERATIVE_AI_KEY=your_key_here
# RESEND_API_KEY=your_key_here
```

### 3. Create Database (Backend)

Make sure MySQL is running and create the database:

```bash
mysql -u root -p -e "CREATE DATABASE dinnerwise;"
```

### 4. Run Migrations (Backend)

```bash
cd backend
npm run migrate
```

This will create all required tables.

### 5. Seed Data (Backend)

The seed script drops and recreates data, then loads users, categories, tags,
new cities, TripAdvisor restaurants and events.

```bash
cd backend
npm run build
npm run seed
```

If you want TripAdvisor data (to see restaurants and events), set `TRIPADVISOR_API_KEY` in `.env` before seeding.

### 6. Start Development Servers

Frontend:

```bash
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

The backend server will start at `http://localhost:3001` and log its configuration.

## Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database (requires `npm run build` first)

## Backend Environment Details

### Development vs Production

- Always required: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`
- Dev defaults: `NODE_ENV=development`, `FRONTEND_URL=http://localhost:5173`, `API_PUBLIC_URL=http://localhost:3001`
- Prod overrides: `NODE_ENV=production`, `FRONTEND_URL=https://your-domain.com`, `API_PUBLIC_URL=https://api.your-domain.com`
- Optional integrations: `TRIPADVISOR_API_KEY`, `GOOGLE_GENERATIVE_AI_KEY`, `RESEND_API_KEY`

## Backend API Endpoints

All endpoints are prefixed with `/api/v1/` in production configuration.

### Health Check

- `GET /health` - Server health check

### Events

- `GET /events` - Get all events
- `GET /events/:id` - Get event by ID
- `POST /events/:id/report` - Report an event

### Restaurants

- `GET /restaurants` - Get all restaurants
- `GET /restaurants/:id` - Get restaurant by ID
- `GET /restaurants/:id/events` - Get events for a restaurant

### And more... (see routes/ directory)

## Database Schema

Run migrations to create tables:

- `users` - User profiles
- `events` - Events
- `restaurants` - TripAdvisor restaurants
- `categories` - Event categories
- `tags` - Event tags
- `user_reports` - User reports
- `event_reports` - Event reports

## Deployment

### Before Deploying

1. Update environment variables for production:

   ```
   NODE_ENV=production
   API_PUBLIC_URL=https://api.your-domain.com
   FRONTEND_URL=https://your-domain.com
   ```

2. Verify all required variables are set
3. Run migrations on production database
4. Test endpoints against production URLs

## Backend Development

### Code Structure

```
src/
	├── config/          # Configuration management
	├── middleware/      # Express middleware
	├── routes/          # API routes
	├── services/        # Business logic
	├── migrations/      # Database schema
	├── app.ts          # Express app setup
	├── db.ts           # Database connection
	└── server.ts       # Server entry point
```