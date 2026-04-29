import { Router, Request, Response } from 'express';
import { clerkClient, getAuth } from '@clerk/express';
import * as accountService from '../services/accountUserService.js';

const router = Router();

/**
 * GET /auth/account/me
 * Get own account information
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const clerkUserId = auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (typeof clerkUserId !== 'string' || !clerkUserId.startsWith('user_')) {
      return res.status(400).json({ error: 'Invalid Clerk user id' });
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
      return res.status(500).json({ error: 'Failed to resolve local account' });
    }

    return res.status(200).json(account);
  } catch (error: any) {
    console.error('[getOwnAccount] Unexpected error:', error);
    return res.status(500).json({ error: 'Failed to get account' });
  }
});

/**
 * DELETE /auth/account/me
 * Delete own account and Clerk user
 * Deletes bboth local MySQL row and the Clerk user
 */
router.delete('/me', async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);

    if (!auth?.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const clerkUserId = auth.userId;

    if (typeof clerkUserId !== 'string' || !clerkUserId.startsWith('user_')) {
      return res.status(400).json({ error: 'Invalid Clerk user id' });
    }

    // Delete local row
    try {
      await accountService.deleteAccountByClerkId(clerkUserId);
    } catch (dbError: any) {
      console.error('[deleteOwnAccount] local delete failed:', dbError.message);
      return res.status(500).json({ error: 'Failed to delete local account' });
    }

    // Delete Clerk user
    try {
      await clerkClient.users.deleteUser(clerkUserId);
    } catch (clerkError: any) {
      console.error('[deleteOwnAccount] Clerk delete failed:', clerkError);
      return res.status(500).json({ error: 'Failed to delete Clerk user' });
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[deleteOwnAccount] Unexpected error:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;