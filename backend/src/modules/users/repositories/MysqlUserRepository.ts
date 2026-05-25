import { db } from '../../../shared/db/mysql.js';
import type { UserRepository } from './UserRepository.js';

export class MysqlUserRepository implements UserRepository {
  async list(): Promise<any[]> {
    const [users] = await db.query(`
      SELECT id, name, alias, bio, profile_picture_url, banner_picture_url
      FROM users
      ORDER BY id
    `);
    return users as any[];
  }

  async search(term: string): Promise<any[]> {
    const searchTerm = term.toLowerCase() + '%';

    const [rows]: any[] = await db.query(
      `
      SELECT *
      FROM users
      WHERE LOWER(name) LIKE ?
         OR LOWER(name) LIKE ?
         OR LOWER(alias) LIKE ?
      ORDER BY name ASC
      `,
      [searchTerm, `% ${searchTerm}`, searchTerm]
    );

    return rows as any[];
  }

  async getByAlias(alias: string): Promise<any | null> {
    const [[user]]: any = await db.query(
      'SELECT id, name, alias, bio, profile_picture_url, banner_picture_url FROM users WHERE alias = ?',
      [alias]
    );
    return user || null;
  }

  async getById(id: number): Promise<any | null> {
    const [[user]]: any = await db.query(
      'SELECT id, name, alias, bio, profile_picture_url, banner_picture_url FROM users WHERE id = ?',
      [id]
    );
    return user || null;
  }
}
