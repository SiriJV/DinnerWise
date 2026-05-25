import type { Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { AccountUserService } from '../services/AccountUserService.js';

export class AccountUserController {
  constructor(private accountService: AccountUserService) {}

  getMe = async (req: Request, res: Response) => {
    const auth = getAuth(req);
    const clerkUserId = auth?.userId;

    if (!clerkUserId) {
      throw ApiError.unauthorized('Inte inloggad');
    }

    if (typeof clerkUserId !== 'string' || !clerkUserId.startsWith('user_')) {
      throw ApiError.badRequest('Ogiltigt Clerk-anvandar-ID');
    }

    let email = 'unknown@example.com';
    let firstName: string | undefined;
    let lastName: string | undefined;
    let invitedRole: string | undefined;

    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      email = clerkUser.emailAddresses?.[0]?.emailAddress || email;
      firstName = clerkUser.firstName || undefined;
      lastName = clerkUser.lastName || undefined;
      invitedRole = (clerkUser.publicMetadata as any)?.invitedRole as string | undefined;
    } catch (clerkErr: any) {
      console.warn(
        `[sync] Could not fetch Clerk user details (will use defaults): ${clerkErr.message}`
      );
    }

    const account = await this.accountService.findOrCreateLocalAccount(
      clerkUserId,
      email,
      firstName,
      lastName,
      invitedRole
    );

    if (!account) {
      throw ApiError.internal('Kunde inte hamta lokalt konto');
    }

    return res.status(200).json({ success: true, data: account });
  };

  deleteMe = async (req: Request, res: Response) => {
    const auth = getAuth(req);

    if (!auth?.userId) {
      throw ApiError.unauthorized('Inte inloggad');
    }

    const clerkUserId = auth.userId;

    if (typeof clerkUserId !== 'string' || !clerkUserId.startsWith('user_')) {
      throw ApiError.badRequest('Ogiltigt Clerk-anvandar-ID');
    }

    try {
      await this.accountService.deleteAccountByClerkId(clerkUserId);
    } catch (dbError: any) {
      console.error('[deleteOwnAccount] local delete failed:', dbError.message);
      throw ApiError.internal('Kunde inte ta bort lokalt konto');
    }

    try {
      await clerkClient.users.deleteUser(clerkUserId);
    } catch (clerkError: any) {
      console.error('[deleteOwnAccount] Clerk delete failed:', clerkError);
      throw ApiError.internal('Kunde inte ta bort Clerk-anvandare');
    }

    return res.status(200).json({ success: true, data: { deleted: true } });
  };
}