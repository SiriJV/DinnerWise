import { db } from '../../../shared/db/mysql.js';
import type { AccountUser, AccountUserRole } from '../domain/AccountUser.js';
import type { AccountUserRepository } from './AccountUserRepository.js';

export class MysqlAccountUserRepository implements AccountUserRepository {
  async getById(id: number): Promise<AccountUser | null> {
    const [rows]: any[] = await db.query('SELECT * FROM account_users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  async getByClerkId(clerkUserId: string): Promise<AccountUser | null> {
    const [rows]: any[] = await db.query(
      'SELECT * FROM account_users WHERE clerk_user_id = ?',
      [clerkUserId]
    );
    return rows[0] || null;
  }

  async getByEmail(email: string): Promise<AccountUser | null> {
    const [rows]: any[] = await db.query('SELECT * FROM account_users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  async getAll(): Promise<AccountUser[]> {
    const [rows]: any[] = await db.query(
      'SELECT id, clerk_user_id, email, first_name, last_name, role, created_at, updated_at FROM account_users ORDER BY created_at DESC'
    );
    return rows as AccountUser[];
  }

  async linkClerkId(accountId: number, clerkUserId: string): Promise<AccountUser | null> {
    await db.execute('UPDATE account_users SET clerk_user_id = ? WHERE id = ?', [
      clerkUserId,
      accountId,
    ]);
    return this.getById(accountId);
  }

  async updateRole(accountId: number, role: AccountUserRole): Promise<AccountUser | null> {
    await db.execute('UPDATE account_users SET role = ? WHERE id = ?', [role, accountId]);
    return this.getById(accountId);
  }

  async deleteById(accountId: number): Promise<void> {
    await db.execute('DELETE FROM account_users WHERE id = ?', [accountId]);
  }

  async deleteByClerkId(clerkUserId: string): Promise<void> {
    await db.execute('DELETE FROM account_users WHERE clerk_user_id = ?', [clerkUserId]);
  }

  async upsertFromClerk(params: {
    clerkUserId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    invitedRole?: string;
  }): Promise<AccountUser | null> {
    const { clerkUserId, email, firstName, lastName, invitedRole } = params;
    const existing = await this.getByClerkId(clerkUserId);

    if (existing) {
      const shouldUpgrade = invitedRole === 'admin' && existing.role !== 'admin';

      await db.execute(
        `UPDATE account_users
            SET email      = ?,
                first_name = COALESCE(?, first_name),
                last_name  = COALESCE(?, last_name)
                ${shouldUpgrade ? ", role = 'admin'" : ''}
          WHERE clerk_user_id = ?`,
        [email, firstName || null, lastName || null, clerkUserId]
      );

      return this.getByClerkId(clerkUserId);
    }

    const initialRole = invitedRole === 'admin' ? 'admin' : 'user';

    await db.execute(
      `INSERT INTO account_users (clerk_user_id, email, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email      = VALUES(email),
         first_name = COALESCE(VALUES(first_name), first_name),
         last_name  = COALESCE(VALUES(last_name), last_name)`
      ,
      [clerkUserId, email, firstName || null, lastName || null, initialRole]
    );

    return this.getByClerkId(clerkUserId);
  }
}