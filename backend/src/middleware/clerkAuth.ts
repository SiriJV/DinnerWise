import { Request, Response, NextFunction } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { ApiError } from '../utils/ApiError.js';
import { MysqlAccountUserRepository } from '../modules/accountUsers/repositories/MysqlAccountUserRepository.js';
import { AccountUserService } from '../modules/accountUsers/services/AccountUserService.js';

process.stderr.write('[STARTUP] clerkAuth.ts file loaded!\n');

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string;
        sessionId?: string;
      };
      currentAccount?: {
        id: number;
        clerk_user_id: string | null;
        email: string;
        first_name: string | null;
        last_name: string | null;
        role: 'user' | 'admin';
        created_at: string;
        updated_at: string;
      };
    }
  }
}

const accountRepo = new MysqlAccountUserRepository();
const accountService = new AccountUserService(accountRepo);

export async function resolveCurrentAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = getAuth(req);
    const clerkUserId = auth?.userId;

    if (!clerkUserId) {
      return next();
    }

    let email = 'unknown@example.com';
    let firstName: string | undefined;
    let lastName: string | undefined;

    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress || email;
      firstName = clerkUser.firstName || undefined;
      lastName = clerkUser.lastName || undefined;

      const invitedRole = (clerkUser.publicMetadata as any)?.invitedRole as string | undefined;

      const account = await accountService.findOrCreateLocalAccount(
        clerkUserId,
        email,
        firstName,
        lastName,
        invitedRole
      );

      if (account) {
        req.currentAccount = account;
      }
    } catch (clerkErr: any) {
      console.warn('Unable to fetch Clerk profile:', clerkErr);

      const account = await accountService.findOrCreateLocalAccount(
        clerkUserId,
        email,
        firstName,
        lastName
      );

      if (account) {
        req.currentAccount = account;
      }
    }

    next();
  } catch (error) {
    console.error('Error resolving current account:', error);
    next();
  }
}

export async function getCurrentAccount(clerkUserId: string) {
  try {
    return await accountService.getAccountByClerkId(clerkUserId);
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}

export async function createAccountFromClerk(
  clerkUserId: string,
  email: string,
  firstName?: string,
  lastName?: string
) {
  try {
    const existing = await getCurrentAccount(clerkUserId);
    if (existing) {
      return existing;
    }

    return accountService.findOrCreateLocalAccount(clerkUserId, email, firstName, lastName);
  } catch (error) {
    console.error('Error creating account from Clerk:', error);
    throw error;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const hasAuth = !!req.auth?.userId;
  
  if (!hasAuth) {
    const hasHeader = !!req.headers.authorization;
    const headerPrefix = req.headers.authorization ? req.headers.authorization.substring(0, 30) : 'none';
    console.log('[requireAuth REJECT]', { path: req.path, header: hasHeader, userId: !!req.auth?.userId });
    return next(ApiError.unauthorized('Inte inloggad - Clerk-autentisering krävs'));
  }
  
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.currentAccount) {
    return next(ApiError.unauthorized('Inte inloggad - konto saknas'));
  }

  if (req.currentAccount.role !== 'admin') {
    return next(ApiError.forbidden('Behörighet saknas - admin krävs'));
  }

  next();
}

export function canDeleteAccount(accountId: number): boolean {
  return true;
}