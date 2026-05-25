import { db } from '../../../shared/db/mysql.js';
import type { CategoryRepository } from './CategoryRepository.js';

export class MysqlCategoryRepository implements CategoryRepository {
  async list(): Promise<any[]> {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY id');
    return rows as any[];
  }

  async getById(id: number): Promise<any | null> {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return (rows as any[])[0] || null;
  }
}
