import { db } from '../../../shared/db/mysql.js';
import type { CityRepository } from './CityRepository.js';

export class MysqlCityRepository implements CityRepository {
  async list(search?: string | null): Promise<any[]> {
    const q = search?.toLowerCase();

    let sql = 'SELECT * FROM new_cities';
    const params: any[] = [];

    if (q) {
      sql += ' WHERE LOWER(name) LIKE ?';
      params.push(`${q}%`);
    }

    sql += ' ORDER BY id';

    const [rows] = await db.query(sql, params);
    return rows as any[];
  }

  async search(term: string): Promise<any[]> {
    const searchTerm = term.toLowerCase();

    const [rows] = await db.query(
      `
      SELECT *
      FROM new_cities
      WHERE LOWER(name) LIKE ? OR LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${searchTerm}%`, `% ${searchTerm}%`]
    );

    return rows as any[];
  }
}
