// Migration runner for account_users table
// Run with: npm run migrate
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    const migrationFile = path.join(__dirname, '..', 'migrations', '001_create_account_users_table.sql');
    const sql = fs.readFileSync(migrationFile, 'utf-8');
    
    console.log('Running migration: 001_create_account_users_table.sql');
    
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.query(statement);
      }
    }
    
    console.log('✓ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();