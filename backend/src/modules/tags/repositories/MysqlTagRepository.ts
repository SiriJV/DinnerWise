import { db } from '../../../shared/db/mysql.js';
import type { Tag } from '../domain/Tag.js';
import type { TagRepository } from './TagRepository.js';

export class MysqlTagRepository implements TagRepository {
  async list(): Promise<Tag[]> {
    const [rows] = await db.query('SELECT id, name, category_id FROM tags ORDER BY id');
    return rows as Tag[];
  }

  async search(term: string): Promise<Tag[]> {
    const searchTerm = term.toLowerCase();
    const [rows] = await db.query(
      `
      SELECT id, name, category_id
      FROM tags
      WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${searchTerm}%`, `% ${searchTerm}%`]
    );

    return rows as Tag[];
  }

  async listByCategory(categoryId: number): Promise<Tag[]> {
    const [rows] = await db.query(
      'SELECT id, name, category_id FROM tags WHERE category_id = ? ORDER BY name',
      [
      categoryId,
    ]
    );
    return rows as Tag[];
  }
}
