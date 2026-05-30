// Migration runner for SQL migration files
// Run with: npm run migrate
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    const distMigrationsDir = path.join(__dirname, '..', 'migrations');
    const srcMigrationsDir = path.join(process.cwd(), 'src', 'migrations');
    const migrationsDir = fs.existsSync(distMigrationsDir) ? distMigrationsDir : srcMigrationsDir;

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      process.exit(0);
    }

    for (const migrationFileName of migrationFiles) {
      const migrationFile = path.join(migrationsDir, migrationFileName);
      const sql = fs.readFileSync(migrationFile, 'utf-8');

      console.log(`Running migration: ${migrationFileName}`);

      const statements = sql.split(';').filter((stmt) => stmt.trim());

      for (const statement of statements) {
        if (statement.trim()) {
          await db.query(statement);
        }
      }
    }

    console.log('✓ Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();