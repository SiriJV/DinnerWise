/**
 * Environment Configuration
 * 
 * Centralized configuration management for DinnerWise backend.
 * Validates all required environment variables at startup.
 * Fails fast if configuration is incomplete.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

const getEnvVar = (key: string, fallback?: string): string => {
  const value = process.env[key];
  
  if (value) return value;
  if (fallback !== undefined) return fallback;
  
  throw new Error(
    `Missing required environment variable: ${key}\n` +
    `Please set ${key} in your .env file or as a system environment variable.\n` +
    `See .env.example for reference.`
  );
};

const getEnvNumber = (key: string, fallback?: number): number => {
  const value = process.env[key];
  
  if (value === undefined || value === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
  }
  
  return parsed;
};

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

export const env = {
  // Application
  node: {
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    isProd: process.env.NODE_ENV === 'production',
  },

  // Server
  server: {
    port: getEnvNumber('PORT', 3001),
    host: process.env.HOST || 'localhost',
  },

  // Database
  db: {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: getEnvNumber('DB_PORT', 3306),
    user: getEnvVar('DB_USER', 'root'),
    password: getEnvVar('DB_PASSWORD', 'root'),
    database: getEnvVar('DB_NAME', 'dinnerwise'),
    // Connection pool settings
    connectionLimit: getEnvNumber('DB_CONNECTION_LIMIT', 10),
    waitForConnections: true,
    queueLimit: 0,
  },

  // Clerk Authentication
  clerk: {
    secretKey: getEnvVar('CLERK_SECRET_KEY'),
    publishableKey: getEnvVar('CLERK_PUBLISHABLE_KEY'),
  },

  // Frontend URL (for CORS)
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },

  // API Configuration
  api: {
    // This is what FRONTEND uses to reach the backend
    publicUrl: process.env.API_PUBLIC_URL || 'http://localhost:3001',
  },
} as const;

// ============================================================================
// STARTUP VALIDATION
// ============================================================================

/**
 * Validates the environment configuration at startup.
 * Should be called immediately when the server starts.
 * 
 * @throws Error if any required configuration is invalid
 */
export function validateEnv(): void {
  const errors: string[] = [];

  // Validate database connection
  if (!env.db.host) errors.push('DB_HOST is required');
  if (!env.db.user) errors.push('DB_USER is required');
  if (!env.db.password) errors.push('DB_PASSWORD is required');
  if (!env.db.database) errors.push('DB_NAME is required');

  // Validate Clerk
  if (!env.clerk.secretKey) errors.push('CLERK_SECRET_KEY is required');
  if (!env.clerk.publishableKey) errors.push('CLERK_PUBLISHABLE_KEY is required');

  if (errors.length > 0) {
    console.error('\n❌ CONFIGURATION ERRORS:');
    errors.forEach((error, i) => console.error(`   ${i + 1}. ${error}`));
    console.error('\nPlease check your .env file. See .env.example for reference.\n');
    process.exit(1);
  }
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Logs environment configuration at startup (without exposing secrets).
 * Useful for debugging deployment issues.
 */
export function logEnvInfo(): void {
  console.log('\n[CONFIG] Environment Information:');
  console.log(`  Environment: ${env.node.env}`);
  console.log(`  Server: ${env.server.host}:${env.server.port}`);
  console.log(`  Database: ${env.db.host}:${env.db.port}/${env.db.database}`);
  console.log(`  Database Pool: ${env.db.connectionLimit} connections max`);
  console.log(`  Frontend URL: ${env.frontend.url}`);
  console.log(`  API Public URL: ${env.api.publicUrl}`);
  console.log(`  Clerk: ${env.clerk.publishableKey ? '✓ Configured' : '✗ Missing'}`);
  console.log();
}
