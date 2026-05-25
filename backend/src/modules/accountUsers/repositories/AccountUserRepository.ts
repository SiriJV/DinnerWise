import type { AccountUser, AccountUserRole } from '../domain/AccountUser.js';

export interface AccountUserRepository {
  getById(id: number): Promise<AccountUser | null>;
  getByClerkId(clerkUserId: string): Promise<AccountUser | null>;
  getByEmail(email: string): Promise<AccountUser | null>;
  getAll(): Promise<AccountUser[]>;
  linkClerkId(accountId: number, clerkUserId: string): Promise<AccountUser | null>;
  updateRole(accountId: number, role: AccountUserRole): Promise<AccountUser | null>;
  deleteById(accountId: number): Promise<void>;
  deleteByClerkId(clerkUserId: string): Promise<void>;
  upsertFromClerk(params: {
    clerkUserId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    invitedRole?: string;
  }): Promise<AccountUser | null>;
}