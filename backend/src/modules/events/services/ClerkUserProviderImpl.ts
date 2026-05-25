import { clerkClient } from '@clerk/express';
import type { ClerkUserProvider, ClerkUserProfile } from './ClerkUserProvider.js';

export class ClerkUserProviderImpl implements ClerkUserProvider {
  async getUserProfile(clerkUserId: string): Promise<ClerkUserProfile | null> {
    try {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      return {
        email: clerkUser.emailAddresses?.[0]?.emailAddress || 'unknown@example.com',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        invitedRole: (clerkUser.publicMetadata as any)?.invitedRole as string | undefined,
      };
    } catch (err) {
      console.warn('Could not fetch Clerk user profile:', err);
      return null;
    }
  }
}
