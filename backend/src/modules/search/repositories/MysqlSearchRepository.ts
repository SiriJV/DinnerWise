import { db } from '../../../shared/db/mysql.js';
import type { SearchRepository } from './SearchRepository.js';

export class MysqlSearchRepository implements SearchRepository {
  async searchEvents(term: string, limit: number): Promise<any[]> {
    const [events] = await db.query(
      `SELECT 
  e.id,
  e.title,
  e.description,
  e.category_id,
  e.restaurant_id,
  e.current_participants,
  e.max_participants,
  e.price,
  e.date,
  e.start_time,
  e.end_time,
  r.name AS restaurant_name,
  r.address_string AS restaurant_address,
  r.city AS restaurant_city
FROM events e
JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
WHERE e.title LIKE ? OR e.description LIKE ?
ORDER BY e.date ASC
LIMIT ?`,
      [term, term, limit]
    );

    return events as any[];
  }

  async searchCities(term: string, limit: number): Promise<any[]> {
    const [rows] = await db.query(
      `SELECT id, name, latitude, longitude
         FROM new_cities
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
      [term, limit]
    );

    return rows as any[];
  }

  async searchRestaurants(term: string, limit: number): Promise<any[]> {
    const [rows] = await db.query(
      `SELECT id, name, city
         FROM tripadvisor_restaurants
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
      [term, limit]
    );

    return rows as any[];
  }

  async searchUsers(term: string, limit: number): Promise<any[]> {
    const [rows] = await db.query(
      `SELECT id, name, alias
        FROM users
        WHERE name LIKE ? OR alias LIKE ?
        ORDER BY name ASC
        LIMIT ?`,
      [term, term, limit]
    );

    return rows as any[];
  }

  async searchTags(term: string, limit: number): Promise<any[]> {
    const [rows] = await db.query(
      `SELECT id, name
         FROM tags
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
      [term, limit]
    );

    return rows as any[];
  }

  async searchCategories(term: string, limit: number): Promise<any[]> {
    const [rows] = await db.query(
      `SELECT id, name
         FROM categories
         WHERE name LIKE ?
         ORDER BY name ASC
         LIMIT ?`,
      [term, limit]
    );

    return rows as any[];
  }
}
