import { db } from '../../../shared/db/mysql.js';
import type { TripadvisorRepository } from './TripadvisorRepository.js';

export class MysqlTripadvisorRepository implements TripadvisorRepository {
  async listRestaurants(): Promise<any[]> {
    const [rows] = await db.query('SELECT * FROM tripadvisor_restaurants');
    return rows as any[];
  }
}
