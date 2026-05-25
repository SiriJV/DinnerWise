import { API_URL, unwrapApiResponse } from './config';

export type Tag = {
  id: number;
  name: string;
  category_id?: number;
};

export async function fetchTags(): Promise<Tag[]> {
  try {
    const res = await fetch(`${API_URL}/tags`);
    if (!res.ok) {
      throw new Error('Failed to fetch tags');
    }
    const data = unwrapApiResponse<Tag[]>(await res.json());
    return data;
  } catch (err) {
    console.error('Failed to load tags:', err);
    return [];
  }
}

export async function fetchTagsByCategory(categoryId: number): Promise<Tag[]> {
  try {
    const res = await fetch(`${API_URL}/tags/category/${categoryId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch tags');
    }
    const data = unwrapApiResponse<Tag[]>(await res.json());
    return data;
  } catch (err) {
    console.error(`Failed to load tags for category ${categoryId}:`, err);
    return [];
  }
}
