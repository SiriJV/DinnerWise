import { db } from '../../../shared/db/mysql.js';
import type { EventFilters } from '../dto/EventFilters.js';
import type { EventListItem } from '../domain/EventListItem.js';
import type { EventRepository } from './EventRepository.js';

export class MysqlEventRepository implements EventRepository {
  async listUpcoming(filters: EventFilters): Promise<EventListItem[]> {
    const { categoryIds, restaurantId, cityIds, priceIds, date, order, tagIds } = filters;

    let sql = `
    SELECT 
      DISTINCT e.id,
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
    JOIN new_cities c ON r.city = c.name
  `;

    if (tagIds.length > 0) {
      sql += `
      JOIN event_tags et ON e.id = et.event_id
    `;
    }

    sql += ` WHERE e.date >= CURDATE() `;

    const params: any[] = [];

    if (cityIds.length > 0) {
      sql += ` AND c.id IN (${cityIds.map(() => '?').join(',')}) `;
      params.push(...cityIds);
    }

    if (categoryIds.length > 0) {
      sql += ` AND e.category_id IN (${categoryIds.map(() => '?').join(',')}) `;
      params.push(...categoryIds);
    }

    if (restaurantId) {
      sql += ` AND e.restaurant_id = ? `;
      params.push(restaurantId);
    }

    if (priceIds.length > 0) {
      const priceConditions: string[] = [];
      priceIds.forEach((priceId) => {
        if (priceId === 1) priceConditions.push('e.price < 50');
        else if (priceId === 2) priceConditions.push('e.price BETWEEN 50 AND 100');
        else if (priceId === 3) priceConditions.push('e.price > 100');
      });
      if (priceConditions.length > 0) {
        sql += ` AND (${priceConditions.join(' OR ')}) `;
      }
    }

    if (date) {
      sql += ` AND e.date = ? `;
      params.push(date);
    }

    if (tagIds.length > 0) {
      sql += ` AND et.tag_id IN (${tagIds.map(() => '?').join(',')}) `;
      params.push(...tagIds);
    }

    if (order === 'price') {
      sql += ` ORDER BY e.price ASC, e.date ASC `;
    } else if (order === 'availability') {
      sql += ` ORDER BY e.current_participants ASC, e.date ASC `;
    } else {
      sql += ` ORDER BY e.date ASC, e.start_time ASC `;
    }

    const [rows] = await db.query(sql, params);
    return rows as EventListItem[];
  }

  async getById(id: number): Promise<EventListItem | null> {
    const [rows] = await db.query(
      `
      SELECT 
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
      WHERE e.id = ?
      `,
      [id]
    );

    const events = rows as EventListItem[];
    return events[0] ?? null;
  }

  async listTags(eventId: number): Promise<any[]> {
    const [rows] = await db.query(
      `
      SELECT t.id, t.name, t.category_id
      FROM tags t
      JOIN event_tags et ON t.id = et.tag_id
      WHERE et.event_id = ?
      `,
      [eventId]
    );

    return rows as any[];
  }

  async exists(eventId: number): Promise<boolean> {
    const [eventRows] = await db.query('SELECT id FROM events WHERE id = ?', [eventId]);
    return Array.isArray(eventRows) && eventRows.length > 0;
  }

  async hasOpenReport(eventId: number, reporterId: number): Promise<boolean> {
    const [existingReports] = await db.query(
      `SELECT id FROM event_reports 
         WHERE event_id = ? AND reported_by_account_user_id = ? AND status = 'open'`,
      [eventId, reporterId]
    );

    return Array.isArray(existingReports) && existingReports.length > 0;
  }

  async createReport(params: {
    eventId: number;
    reporterId: number | null;
    reason: string | null;
  }): Promise<void> {
    const { eventId, reporterId, reason } = params;
    await db.execute(
      `INSERT INTO event_reports (event_id, reported_by_account_user_id, reason, status)
       VALUES (?, ?, ?, 'open')`,
      [eventId, reporterId, reason || null]
    );
  }
}
