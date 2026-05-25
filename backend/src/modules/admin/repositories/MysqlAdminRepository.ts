import { db } from '../../../shared/db/mysql.js';
import type { AdminRepository } from './AdminRepository.js';

export class MysqlAdminRepository implements AdminRepository {
  async deleteUserWithReports(userId: number): Promise<{ clerkUserId: string | null } | null> {
    let connection: any;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const [rows]: any[] = await connection.query(
        'SELECT id, clerk_user_id, email FROM account_users WHERE id = ? LIMIT 1',
        [userId]
      );

      const targetUser = Array.isArray(rows) ? rows[0] : null;
      if (!targetUser) {
        await connection.rollback();
        return null;
      }

      await connection.query('DELETE FROM user_reports WHERE reported_by_account_user_id = ?', [
        userId,
      ]);

      const [deletedUsers]: any[] = await connection.query(
        'DELETE FROM account_users WHERE id = ?',
        [userId]
      );

      const deletedRows = deletedUsers?.affectedRows ?? 0;
      if (deletedRows === 0) {
        await connection.rollback();
        return null;
      }

      await connection.commit();

      return { clerkUserId: targetUser.clerk_user_id || null };
    } finally {
      connection?.release?.();
    }
  }

  async listEvents(): Promise<any[]> {
    const [rows]: any[] = await db.query(`
      SELECT
        e.id,
        e.title,
        e.description,
        e.date,
        e.start_time,
        e.end_time,
        e.price,
        e.current_participants,
        e.max_participants,
        e.restaurant_id,
        r.name AS restaurant_name,
        e.category_id,
        c.name AS category_name
      FROM events e
      LEFT JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      LEFT JOIN categories c ON e.category_id = c.id
      ORDER BY e.id DESC
    `);

    return rows;
  }

  async getEventById(eventId: number): Promise<any | null> {
    const [rows]: any[] = await db.query(
      `
      SELECT
        e.id,
        e.title,
        e.description,
        e.date,
        e.start_time,
        e.end_time,
        e.price,
        e.current_participants,
        e.max_participants,
        e.restaurant_id,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address,
        r.city AS restaurant_city,
        e.category_id,
        c.name AS category_name
      FROM events e
      LEFT JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      LEFT JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
      LIMIT 1
      `,
      [eventId]
    );

    return Array.isArray(rows) ? rows[0] : null;
  }

  async deleteEvent(eventId: number): Promise<void> {
    let connection: any;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const [eventRows]: any[] = await connection.query(
        'SELECT id, title FROM events WHERE id = ? LIMIT 1',
        [eventId]
      );

      if (!Array.isArray(eventRows) || eventRows.length === 0) {
        await connection.rollback();
        throw new Error('NOT_FOUND');
      }

      await connection.query('DELETE FROM event_reports WHERE event_id = ?', [eventId]);
      await connection.query('DELETE FROM event_tags WHERE event_id = ?', [eventId]);
      await connection.query('DELETE FROM events WHERE id = ?', [eventId]);

      await connection.commit();
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      connection?.release?.();
    }
  }

  async deleteEventReport(reportId: number): Promise<number> {
    const [result]: any[] = await db.query('DELETE FROM event_reports WHERE id = ?', [reportId]);
    return result?.affectedRows ?? 0;
  }

  async listReportedUsers(): Promise<any[]> {
    const [rows]: any[] = await db.query(`
      SELECT
        ur.id AS report_id,
        ur.reported_account_user_id,
        ur.reported_by_account_user_id,
        ur.reason,
        ur.created_at,
        u.name AS reported_user_email,
        u.alias AS reported_user_alias,
        NULL AS reported_user_first_name,
        NULL AS reported_user_last_name,
        NULL AS reported_user_role,
        NULL AS reported_user_clerk_user_id,
        reporter.email AS reporter_email
      FROM user_reports ur
      JOIN users u ON ur.reported_account_user_id = u.id
      LEFT JOIN account_users reporter ON ur.reported_by_account_user_id = reporter.id
      ORDER BY ur.created_at DESC
    `);

    return Array.isArray(rows) ? rows : [];
  }

  async deleteUserReport(reportId: number): Promise<number> {
    const [result]: any[] = await db.query('DELETE FROM user_reports WHERE id = ?', [reportId]);
    return result?.affectedRows ?? 0;
  }

  async listReportedEvents(): Promise<any[]> {
    const [rows]: any[] = await db.query(`
      SELECT
        er.id AS report_id,
        er.event_id,
        er.reported_by_account_user_id,
        er.reason,
        er.status,
        er.created_at,
        e.title AS event_title,
        e.date AS event_date,
        e.start_time AS event_start_time,
        e.end_time AS event_end_time,
        e.description AS event_description,
        e.price AS event_price,
        e.current_participants AS event_current_participants,
        e.max_participants AS event_max_participants,
        e.restaurant_id,
        r.name AS restaurant_name,
        r.address_string AS restaurant_address,
        r.city AS restaurant_city,
        e.category_id,
        c.name AS category_name,
        au.email AS reporter_email,
        au.first_name AS reporter_first_name,
        au.last_name AS reporter_last_name
      FROM event_reports er
      JOIN events e ON er.event_id = e.id
      LEFT JOIN tripadvisor_restaurants r ON e.restaurant_id = r.id
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN account_users au ON er.reported_by_account_user_id = au.id
      ORDER BY er.created_at DESC
    `);

    return Array.isArray(rows) ? rows : [];
  }
}
