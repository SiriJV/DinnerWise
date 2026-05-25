import { db } from '../../../shared/db/mysql.js';
import type { Category } from '../domain/Category.js';
import type { CategoryRepository } from './CategoryRepository.js';

export class MysqlCategoryRepository implements CategoryRepository {
  async list(): Promise<Category[]> {
    const [rows] = await db.query('SELECT id, name FROM categories ORDER BY id');
    return rows as Category[];
  }

  async getById(id: number): Promise<Category | null> {
    const [rows] = await db.query('SELECT id, name FROM categories WHERE id = ?', [id]);
    return (rows as Category[])[0] || null;
  }
}