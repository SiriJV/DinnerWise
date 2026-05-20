import { Router, Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import * as accountService from '../services/accountUserService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = Router();

/**
 * GET /auth/account/me
 * Get own account information
 */
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const auth = getAuth(req);
  const clerkUserId = auth?.userId;

  if (!clerkUserId) {
    throw ApiError.unauthorized('Inte inloggad');
  }

  if (typeof clerkUserId !== 'string' || !clerkUserId.startsWith('user_')) {
    throw ApiError.badRequest('Ogiltigt Clerk-användar-ID');
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
    console.warn(`[sync] Could not fetch Clerk user details (will use defaults): ${clerkErr.message}`);
  }

  const account = await accountService.findOrCreateLocalAccount(
    clerkUserId,
    email,
    firstName,
    lastName,
    invitedRole
  );

  if (!account) {
    throw ApiError.internal('Kunde inte hämta lokalt konto');
  }

  return res.status(200).json(account);
}));

/**
 * DELETE /auth/account/me
 * Delete own account and Clerk user
 * Deletes bboth local MySQL row and the Clerk user
 */
router.delete('/me', asyncHandler(async (req: Request, res: Response) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    throw ApiError.unauthorized('Inte inloggad');
  }

  const clerkUserId = auth.userId;

  if (typeof clerkUserId !== 'string' || !clerkUserId.startsWith('user_')) {
    throw ApiError.badRequest('Ogiltigt Clerk-användar-ID');
  }

  try {
    await accountService.deleteAccountByClerkId(clerkUserId);
  } catch (dbError: any) {
    console.error('[deleteOwnAccount] local delete failed:', dbError.message);
    throw ApiError.internal('Kunde inte ta bort lokalt konto');
  }

  try {
    await clerkClient.users.deleteUser(clerkUserId);
  } catch (clerkError: any) {
    console.error('[deleteOwnAccount] Clerk delete failed:', clerkError);
    throw ApiError.internal('Kunde inte ta bort Clerk-användare');
  }

  return res.status(200).json({ success: true });
}));

export default router;