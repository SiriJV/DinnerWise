import mysql from 'mysql2/promise';
import { env } from './config/env.js';

let poolInstance: mysql.Pool | null = null;

const getOrCreatePool = async () => {
  if (poolInstance) return poolInstance;

  try {
    poolInstance = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      waitForConnections: env.db.waitForConnections,
      connectionLimit: env.db.connectionLimit,
      queueLimit: env.db.queueLimit,
    });
    console.log('[DB] ✓ Database pool created successfully');
    return poolInstance;
  } catch (error) {
    console.error('[DB] ✗ Failed to create database pool:', error);
    throw error; // Don't silently fail - let server startup fail visibly
  }
};

export const db = {
  query: async (sql: string, params?: any[]) => {
    const pool = await getOrCreatePool();
    if (!pool) {
      throw new Error('Database not available');
    }
    return pool.query(sql, params);
  },
  execute: async (sql: string, params?: any[]) => {
    const pool = await getOrCreatePool();
    if (!pool) {
      throw new Error('Database not available');
    }
    return pool.execute(sql, params);
  },
  getConnection: async () => {
    const pool = await getOrCreatePool();
    if (!pool) {
      throw new Error('Database not available');
    }
    return pool.getConnection();
  },
};
