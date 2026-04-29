// Services for the local account_users table (app-internal user records).

import { db } from '../db.js';

export async function getAccountById(accountId: number) {
  try {
    const [rows]: any[] = await db.query(
      'SELECT * FROM account_users WHERE id = ?',
      [accountId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting account by ID:', error);
    throw error;
  }
}

export async function getAccountByClerkId(clerkUserId: string) {
  try {
    const [rows]: any[] = await db.query(
      'SELECT * FROM account_users WHERE clerk_user_id = ?',
      [clerkUserId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting account by Clerk ID:', error);
    throw error;
  }
}

export async function getAccountByEmail(email: string) {
  try {
    const [rows]: any[] = await db.query(
      'SELECT * FROM account_users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error getting account by email:', error);
    throw error;
  }
}

export async function linkClerkIdToAccount(accountId: number, clerkUserId: string) {
  try {
    await db.execute(
      'UPDATE account_users SET clerk_user_id = ? WHERE id = ?',
      [clerkUserId, accountId]
    );
    return getAccountById(accountId);
  } catch (error) {
    console.error('Error linking Clerk ID to account:', error);
    throw error;
  }
}

export async function getAllAccounts() {
  try {
    const [rows]: any[] = await db.query(
      'SELECT id, clerk_user_id, email, first_name, last_name, role, created_at, updated_at FROM account_users ORDER BY created_at DESC'
    );
    return rows;
  } catch (error) {
    console.error('Error getting all accounts:', error);
    throw error;
  }
}

export async function updateAccountRole(accountId: number, role: 'user' | 'admin') {
  try {
    await db.execute(
      'UPDATE account_users SET role = ? WHERE id = ?',
      [role, accountId]
    );
    return getAccountById(accountId);
  } catch (error) {
    console.error('Error updating account role:', error);
    throw error;
  }
}

export async function deleteAccount(accountId: number) {
  try {
    await db.execute(
      'DELETE FROM account_users WHERE id = ?',
      [accountId]
    );
    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
}

export async function deleteAccountByClerkId(clerkUserId: string) {
  try {
    const account = await getAccountByClerkId(clerkUserId);
    if (!account) {
      throw new Error('Account not found for Clerk user ID');
    }
    await db.execute(
      'DELETE FROM account_users WHERE clerk_user_id = ?',
      [clerkUserId]
    );
    return true;
  } catch (error) {
    console.error('Error deleting account by Clerk ID:', error);
    throw error;
  }
}

export async function createAccount(
  clerkUserId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  role: 'user' | 'admin' = 'user'
) {
  return findOrCreateLocalAccount(clerkUserId, email, firstName, lastName);
}

export async function findOrCreateLocalAccount(
  clerkUserId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  invitedRole?: string
) {
  try {
    const existing = await getAccountByClerkId(clerkUserId);

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

      const updated = await getAccountByClerkId(clerkUserId);
      return updated;
    }

    const initialRole = invitedRole === 'admin' ? 'admin' : 'user';

    await db.execute(
      `INSERT INTO account_users (clerk_user_id, email, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         email      = VALUES(email),
         first_name = COALESCE(VALUES(first_name), first_name),
         last_name  = COALESCE(VALUES(last_name), last_name)`,
      [clerkUserId, email, firstName || null, lastName || null, initialRole]
    );

    const created = await getAccountByClerkId(clerkUserId);
    return created;
  } catch (error) {
    console.error('Error in findOrCreateLocalAccount:', error);
    throw error;
  }
}