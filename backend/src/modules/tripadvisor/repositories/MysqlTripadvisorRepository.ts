import { db } from '../../../shared/db/mysql.js';
import type { Restaurant } from '../../restaurants/domain/Restaurant.js';
import type { TripadvisorRepository } from './TripadvisorRepository.js';

export class MysqlTripadvisorRepository implements TripadvisorRepository {
  async listRestaurants(): Promise<Restaurant[]> {
    const [rows] = await db.query('SELECT * FROM tripadvisor_restaurants');
    return rows as Restaurant[];
  }
}
