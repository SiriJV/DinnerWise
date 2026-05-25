export interface ClerkUserProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  invitedRole?: string;
}

export interface ClerkUserProvider {
  getUserProfile(clerkUserId: string): Promise<ClerkUserProfile | null>;
}
