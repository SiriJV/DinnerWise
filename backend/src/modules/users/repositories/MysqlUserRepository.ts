import { db } from '../../../shared/db/mysql.js';
import type { UserProfile } from '../domain/UserProfile.js';
import type { UserRepository } from './UserRepository.js';

export class MysqlUserRepository implements UserRepository {
  async list(): Promise<UserProfile[]> {
    const [users] = await db.query(`
      SELECT id, name, alias, bio, profile_picture_url, banner_picture_url
      FROM users
      ORDER BY id
    `);
    return users as UserProfile[];
  }

  async search(term: string): Promise<UserProfile[]> {
    const searchTerm = term.toLowerCase() + '%';

    const [rows]: any[] = await db.query(
      `
      SELECT id, name, alias, bio, profile_picture_url, banner_picture_url
      FROM users
      WHERE LOWER(name) LIKE ?
         OR LOWER(name) LIKE ?
         OR LOWER(alias) LIKE ?
      ORDER BY name ASC
      `,
      [searchTerm, `% ${searchTerm}`, searchTerm]
    );

    return rows as UserProfile[];
  }

  async getByAlias(alias: string): Promise<UserProfile | null> {
    const [[user]]: any = await db.query(
      'SELECT id, name, alias, bio, profile_picture_url, banner_picture_url FROM users WHERE alias = ?',
      [alias]
    );
    return (user as UserProfile) || null;
  }

  async getById(id: number): Promise<UserProfile | null> {
    const [[user]]: any = await db.query(
      'SELECT id, name, alias, bio, profile_picture_url, banner_picture_url FROM users WHERE id = ?',
      [id]
    );
    return (user as UserProfile) || null;
  }
}