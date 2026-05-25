import { db } from '../../../shared/db/mysql.js';
import type { TagRepository } from './TagRepository.js';

export class MysqlTagRepository implements TagRepository {
  async list(): Promise<any[]> {
    const [rows] = await db.query('SELECT * FROM tags ORDER BY id');
    return rows as any[];
  }

  async search(term: string): Promise<any[]> {
    const searchTerm = term.toLowerCase();
    const [rows] = await db.query(
      `
      SELECT *
      FROM tags
      WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${searchTerm}%`, `% ${searchTerm}%`]
    );

    return rows as any[];
  }

  async listByCategory(categoryId: number): Promise<any[]> {
    const [rows] = await db.query('SELECT * FROM tags WHERE category_id = ? ORDER BY name', [
      categoryId,
    ]);
    return rows as any[];
  }
}
