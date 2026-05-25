import { db } from '../../../shared/db/mysql.js';
import type { AccountUserReportRepository } from './AccountUserReportRepository.js';

export class MysqlAccountUserReportRepository implements AccountUserReportRepository {
  async resolveTarget(params: {
    legacyUserId?: number | null;
    name?: string | null;
    alias?: string | null;
  }): Promise<{ accountUserId: number; source: string } | null> {
    const { legacyUserId, name, alias } = params;

    if (legacyUserId && Number.isInteger(legacyUserId) && legacyUserId > 0) {
      const [byIdRows]: any[] = await db.query(
        'SELECT id FROM account_users WHERE id = ? LIMIT 1',
        [legacyUserId]
      );

      if (Array.isArray(byIdRows) && byIdRows.length > 0) {
        return { accountUserId: byIdRows[0].id, source: 'legacy-id' };
      }
    }

    if (name) {
      const [nameRows]: any[] = await db.query(
        `
        SELECT id
        FROM account_users
        WHERE LOWER(TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))) = LOWER(TRIM(?))
        LIMIT 1
        `,
        [name]
      );

      if (Array.isArray(nameRows) && nameRows.length > 0) {
        return { accountUserId: nameRows[0].id, source: 'name' };
      }
    }

    if (alias) {
      const normalizedAlias = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
      const [aliasRows]: any[] = await db.query(
        `
        SELECT id
        FROM account_users
        WHERE REPLACE(REPLACE(LOWER(SUBSTRING_INDEX(email, '@', 1)), '.', ''), '_', '') = ?
        LIMIT 1
        `,
        [normalizedAlias]
      );

      if (Array.isArray(aliasRows) && aliasRows.length > 0) {
        return { accountUserId: aliasRows[0].id, source: 'alias-email' };
      }
    }

    return null;
  }

  async ensureUserReportsTable(): Promise<void> {
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reported_account_user_id INT NOT NULL,
        reported_by_account_user_id INT NULL,
        reason TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_reports_reported_user (reported_account_user_id),
        INDEX idx_user_reports_reporter (reported_by_account_user_id),
        CONSTRAINT fk_user_reports_reported_user
          FOREIGN KEY (reported_account_user_id)
          REFERENCES account_users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_user_reports_reporter
          FOREIGN KEY (reported_by_account_user_id)
          REFERENCES account_users(id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  async resolveReportTargetByUserId(userId: number): Promise<number | null> {
    const [directLookup]: any[] = await db.query(
      'SELECT id FROM account_users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (Array.isArray(directLookup) && directLookup.length > 0) {
      return directLookup[0].id as number;
    }

    const [legacyUser]: any[] = await db.query(
      'SELECT id, name FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (Array.isArray(legacyUser) && legacyUser.length > 0) {
      const legacyName = legacyUser[0].name;

      const [nameMatch]: any[] = await db.query(
        `
          SELECT id
          FROM account_users
          WHERE LOWER(TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))) = LOWER(TRIM(?))
          LIMIT 1
          `,
        [legacyName]
      );

      if (Array.isArray(nameMatch) && nameMatch.length > 0) {
        return nameMatch[0].id as number;
      }
    }

    return null;
  }

  async createReport(params: { reportedAccountUserId: number; reason: string | null }): Promise<void> {
    const { reportedAccountUserId, reason } = params;

    await db.query(
      `
      INSERT INTO user_reports (
        reported_account_user_id,
        reported_by_account_user_id,
        reason,
        created_at
      ) VALUES (?, NULL, ?, NOW())
      `,
      [reportedAccountUserId, reason]
    );
  }
}