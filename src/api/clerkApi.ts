import { API_URL, unwrapApiResponse } from './config';

export interface AccountUser {
  id: number;
  clerk_user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

/**
 * Helper to add Clerk Bearer token to request headers
 */
function getAuthHeaders(token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (!token || token.length === 0) {
    throw new Error('Clerk token is required for authenticated requests');
  }

  headers['Authorization'] = `Bearer ${token}`;

  return headers;
}

export const clerkApi = {
  /**
   * Get current user's account info
   */
  async getCurrentAccount(token?: string): Promise<AccountUser> {
    const response = await fetch(`${API_URL}/auth/account/me`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch account');
    const payload = unwrapApiResponse<AccountUser>(await response.json());
    return payload;
  },

  /**
   * Delete own account
   */
  async deleteOwnAccount(token?: string): Promise<{ deleted: boolean }> {
    if (!token) throw new Error('Clerk token is required');

    const response = await fetch(`${API_URL}/auth/account/me`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`deleteOwnAccount failed: ${response.status} ${text}`);
    }
    
    const payload = unwrapApiResponse<{ deleted: boolean }>(await response.json());
    return payload;
  },

  /**
   * Sync/create account from Clerk user info
   */
  async syncAccount(
    data: {
      clerkUserId: string;
      email: string;
      firstName?: string;
      lastName?: string;
    },
    token?: string
  ): Promise<{ success: boolean; account: AccountUser }> {
    const response = await fetch(`${API_URL}/auth/account/sync`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to sync account');
    const payload = unwrapApiResponse<{ success: boolean; account: AccountUser }>(
      await response.json()
    );
    return payload;
  },

  /**
   * Get all account users (admin only)
   */
  async getAllAccounts(token?: string): Promise<AccountUser[]> {
    const response = await fetch(`${API_URL}/auth/account/all`, {
      method: 'GET',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch accounts');
    const payload = unwrapApiResponse<AccountUser[]>(await response.json());
    return payload;
  },

  /**
   * Update user role (admin only)
   */
  async updateAccountRole(
    accountId: number,
    role: 'user' | 'admin',
    token?: string
  ): Promise<{ success: boolean; account: AccountUser }> {
    const response = await fetch(`${API_URL}/auth/account/${accountId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      credentials: 'include',
      body: JSON.stringify({ role }),
    });

    if (!response.ok) throw new Error('Failed to update role');
    const payload = unwrapApiResponse<{ success: boolean; account: AccountUser }>(
      await response.json()
    );
    return payload;
  },

  /**
   * Delete user account (admin only)
   */
  async deleteAccount(accountId: number, token?: string): Promise<{ deleted: boolean }> {
    const response = await fetch(`${API_URL}/auth/account/${accountId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to delete account');
    const payload = unwrapApiResponse<{ deleted: boolean }>(await response.json());
    return payload;
  },
};