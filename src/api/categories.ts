import { API_URL, unwrapApiResponse } from './config';

export type Category = {
  id: number;
  name: string;
  description?: string;
  cover_picture_url?: string;
};

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = unwrapApiResponse<Category[]>(await res.json());
    return data;
  } catch (err) {
    console.error('Failed to load categories:', err);
    return [];
  }
}

export async function fetchCategoryById(id: number): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/categories/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch category');
    }
    const data = unwrapApiResponse<Category>(await res.json());
    return data;
  } catch (err) {
    console.error(`Failed to load category ${id}:`, err);
    return null;
  }
}
