import type { AccountUser, AccountUserRole } from '../domain/AccountUser.js';
import type { AccountUserRepository } from '../repositories/AccountUserRepository.js';

export class AccountUserService {
  constructor(private repo: AccountUserRepository) {}

  getAccountById(accountId: number): Promise<AccountUser | null> {
    return this.repo.getById(accountId);
  }

  getAccountByClerkId(clerkUserId: string): Promise<AccountUser | null> {
    return this.repo.getByClerkId(clerkUserId);
  }

  getAccountByEmail(email: string): Promise<AccountUser | null> {
    return this.repo.getByEmail(email);
  }

  getAllAccounts(): Promise<AccountUser[]> {
    return this.repo.getAll();
  }

  linkClerkIdToAccount(accountId: number, clerkUserId: string) {
    return this.repo.linkClerkId(accountId, clerkUserId);
  }

  updateAccountRole(accountId: number, role: AccountUserRole) {
    return this.repo.updateRole(accountId, role);
  }

  async deleteAccount(accountId: number): Promise<boolean> {
    await this.repo.deleteById(accountId);
    return true;
  }

  async deleteAccountByClerkId(clerkUserId: string): Promise<boolean> {
    await this.repo.deleteByClerkId(clerkUserId);
    return true;
  }

  createAccount(
    clerkUserId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    role: AccountUserRole = 'user'
  ) {
    return this.findOrCreateLocalAccount(clerkUserId, email, firstName, lastName, role);
  }

  findOrCreateLocalAccount(
    clerkUserId: string,
    email: string,
    firstName?: string,
    lastName?: string,
    invitedRole?: string
  ) {
    return this.repo.upsertFromClerk({
      clerkUserId,
      email,
      firstName,
      lastName,
      invitedRole,
    });
  }
}