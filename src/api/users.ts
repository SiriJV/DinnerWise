import { API_URL, unwrapApiResponse } from './config';

export type User = {
  id: number;
  name: string;
  alias: string;
  bio?: string;
  profile_picture_url?: string;
  banner_picture_url?: string;
};

export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = unwrapApiResponse<User[]>(await res.json());
    return data;
  } catch (err) {
    console.error('Failed to load users:', err);
    return [];
  }
}

export async function fetchUserByAlias(alias: string): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/users/alias/${alias}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = unwrapApiResponse<User>(await res.json());
    return data;
  } catch (err) {
    console.error(`Failed to load user ${alias}:`, err);
    return null;
  }
}

export async function fetchUserById(id: number): Promise<User | null> {
  try {
    const res = await fetch(`${API_URL}/users/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = unwrapApiResponse<User>(await res.json());
    return data;
  } catch (err) {
    console.error(`Failed to load user ${id}:`, err);
    return null;
  }
}
