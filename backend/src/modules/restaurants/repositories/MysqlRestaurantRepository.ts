import { db } from '../../../shared/db/mysql.js';
import type { RestaurantRepository } from './RestaurantRepository.js';

export class MysqlRestaurantRepository implements RestaurantRepository {
  async list(city?: string | null): Promise<any[]> {
    let sql = 'SELECT * FROM tripadvisor_restaurants';
    const params: any[] = [];

    if (city) {
      sql += ' WHERE LOWER(city) = LOWER(?)';
      params.push(city);
    }

    const [rows] = await db.query(sql, params);
    return rows as any[];
  }

  async search(term: string): Promise<any[]> {
    const searchTerm = term.toLowerCase();
    const [rows] = await db.query(
      `
      SELECT *
      FROM tripadvisor_restaurants
      WHERE LOWER(name) LIKE ?
      ORDER BY name ASC
      `,
      [`${searchTerm}%`]
    );
    return rows as any[];
  }

  async listEvents(restaurantId: number): Promise<any[]> {
    const [events] = await db.query(
      `
      SELECT 
        e.id,
        e.title,
        e.description,
        e.category_id,
        e.restaurant_id,
        e.current_participants,
        e.price,
        e.date,
        e.start_time,
        e.end_time,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address
      FROM events e
      JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      WHERE e.restaurant_id = ?
        AND (e.date > CURDATE() OR (e.date = CURDATE() AND e.start_time > CURTIME()))
      ORDER BY e.date ASC, e.start_time ASC
      `,
      [restaurantId]
    );

    return events as any[];
  }

  async getById(id: number): Promise<any | null> {
    const [rows] = await db.query('SELECT * FROM tripadvisor_restaurants WHERE id = ?', [id]);
    return (rows as any[])[0] || null;
  }
}
