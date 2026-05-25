import { clerkClient } from '@clerk/express';
import type { AdminClerkProvider } from './AdminClerkProvider.js';

export class ClerkAdminProviderImpl implements AdminClerkProvider {
  async getUserProfile(clerkUserId: string) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    return {
      email: clerkUser.emailAddresses?.[0]?.emailAddress || 'unknown@example.com',
      firstName: clerkUser.firstName || undefined,
      lastName: clerkUser.lastName || undefined,
      invitedRole: (clerkUser.publicMetadata as any)?.invitedRole as string | undefined,
    };
  }

  async deleteUser(clerkUserId: string): Promise<void> {
    await clerkClient.users.deleteUser(clerkUserId);
  }

  async createInvitation(params: { emailAddress: string; redirectUrl: string }) {
    return clerkClient.invitations.createInvitation({
      emailAddress: params.emailAddress,
      redirectUrl: params.redirectUrl,
      publicMetadata: {
        invitedRole: 'admin',
      },
      notify: true,
    });
  }
}
