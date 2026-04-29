import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function deleteClerkUser(clerkUserId: string): Promise<boolean> {
  try {
    if (!clerkUserId) {
      throw new Error('Clerk user ID is required');
    }

    console.log(`[deleteClerkUser] Attempting to delete Clerk user: ${clerkUserId.substring(0, 10)}...`);

    const result = await clerkClient.users.deleteUser(clerkUserId);

    console.log(`[deleteClerkUser] ✓ Clerk user deleted:`, clerkUserId.substring(0, 10));
    return !!result;
  } catch (error: any) {
    console.error(`[deleteClerkUser] ✗ Failed to delete Clerk user:`, error.message);
    throw error;
  }
}

export default clerkClient;