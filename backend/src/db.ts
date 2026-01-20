import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let poolInstance: mysql.Pool | null = null;

const getOrCreatePool = async () => {
  if (poolInstance) return poolInstance;

  try {
    poolInstance = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'dinnerwise',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Database pool created successfully');
    return poolInstance;
  } catch (error) {
    console.error('Failed to create database pool:', error);
    // Return a mock pool to allow server to start without database
    return null;
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
