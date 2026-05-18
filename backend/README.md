# DinnerWise Backend

Node.js + Express backend for the DinnerWise application.

## Prerequisites

- Node.js 18+ (with npm)
- MySQL 8.0+
- Clerk account (for authentication)

## Getting Started

### 1. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=dinnerwise

# Clerk Authentication (get from https://dashboard.clerk.com)
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Server
PORT=3001
NODE_ENV=development

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
API_PUBLIC_URL=http://localhost:3001
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Database

Make sure MySQL is running and create the database:

```bash
mysql -u root -p -e "CREATE DATABASE dinnerwise;"
```

### 4. Run Migrations

```bash
npm run migrate
```

This will create all required tables.

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3001` and log its configuration.

## Configuration Validation

The server validates all required environment variables at startup.
If any configuration is missing or invalid, the server will:

1. Print clear error messages
2. Exit with status code 1

This ensures you catch configuration issues immediately rather than experiencing cryptic errors later.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations

## Environment Details

### Required Variables

- `DB_HOST` - MySQL host
- `DB_USER` - MySQL user
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `CLERK_SECRET_KEY` - Clerk authentication key
- `CLERK_PUBLISHABLE_KEY` - Clerk public key

### Optional Variables (with defaults)

- `PORT` - Server port (default: 3001)
- `HOST` - Server host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_CONNECTION_LIMIT` - Connection pool size (default: 10)
- `NODE_ENV` - Environment (default: development)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `API_PUBLIC_URL` - Public API URL (default: http://localhost:3001)

## API Endpoints

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

### Production Considerations

- Set `NODE_ENV=production` to enable optimizations
- Use strong, unique values for `CLERK_SECRET_KEY`
- Configure CORS with exact `FRONTEND_URL`
- Monitor database connection pool
- Enable logging with structured format
- Use PM2 or similar for process management

## Troubleshooting

### "Database pool failed to connect"

- Check MySQL is running
- Verify DB_HOST, DB_USER, DB_PASSWORD in .env
- Ensure database exists: `CREATE DATABASE dinnerwise;`

### "Clerk middleware disabled"

- Verify `CLERK_SECRET_KEY` and `CLERK_PUBLISHABLE_KEY` are set in .env
- Get keys from https://dashboard.clerk.com
- Restart server after updating .env

### "CORS error from frontend"

- Ensure `FRONTEND_URL` matches your frontend URL
- In development: `http://localhost:5173`
- In production: `https://your-domain.com`
- Restart server after changing environment variables

### Port already in use

- Change `PORT` in .env to an available port
- Or kill the process using the port:

  ```bash
  # Linux/Mac
  lsof -ti:3001 | xargs kill -9

  # Windows
  Get-NetTCPConnection -LocalPort 3001 | Stop-Process -Force
  ```

## Development

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

### Adding New Routes

1. Create file in `routes/`
2. Import in `app.ts`
3. Mount with `app.use('/path', router)`
4. Update API_SERVER_HOST in error messages if needed

### Adding Migrations

1. Create `.sql` file in `migrations/` with number prefix (001, 002, etc.)
2. Run: `npm run migrate`

## Support

For issues or questions, check:

- `.env.example` for available configuration
- Error messages - they're designed to be helpful
- Database logs for connection issues
- `npm run dev` console output for startup warnings
