import { API_URL, unwrapApiResponse } from './config';

export type SearchType = 'all' | 'events' | 'cities' | 'restaurants' | 'users' | 'tags' | 'categories';

export interface SearchResults {
  type: SearchType;
  results: any;
}

export async function searchApi(q: string, type: SearchType = 'all', limit = 10): Promise<SearchResults> {
  const params = new URLSearchParams({ q, type, limit: limit.toString() });
  const res = await fetch(`${API_URL}/search?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch search results');
  const payload = unwrapApiResponse<SearchResults>(await res.json());
  return payload;
}
