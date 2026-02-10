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
    const res = await fetch('http://localhost:3001/users');
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    const data: User[] = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to load users:', err);
    return [];
  }
}

export async function fetchUserByAlias(alias: string): Promise<User | null> {
  try {
    const res = await fetch(`http://localhost:3001/users/alias/${alias}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const data: User = await res.json();
    return data;
  } catch (err) {
    console.error(`Failed to load user ${alias}:`, err);
    return null;
  }
}

export async function fetchUserById(id: number): Promise<User | null> {
  try {
    const res = await fetch(`http://localhost:3001/users/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch user');
    }
    const data: User = await res.json();
    return data;
  } catch (err) {
    console.error(`Failed to load user ${id}:`, err);
    return null;
  }
}
