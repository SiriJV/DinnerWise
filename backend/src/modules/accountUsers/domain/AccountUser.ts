export type AccountUserRole = 'user' | 'admin';

export interface AccountUser {
  id: number;
  clerk_user_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: AccountUserRole;
  created_at: string;
  updated_at: string;
}