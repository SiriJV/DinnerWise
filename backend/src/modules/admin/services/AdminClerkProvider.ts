export interface AdminClerkProvider {
  getUserProfile(clerkUserId: string): Promise<{
    email: string;
    firstName?: string;
    lastName?: string;
    invitedRole?: string;
  }>;
  deleteUser(clerkUserId: string): Promise<void>;
  createInvitation(params: { emailAddress: string; redirectUrl: string }): Promise<any>;
}
