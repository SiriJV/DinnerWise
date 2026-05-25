import { ApiError } from '../../../shared/errors/ApiError.js';
import type { SearchRepository } from '../repositories/SearchRepository.js';

export type SearchType =
  | 'all'
  | 'events'
  | 'cities'
  | 'restaurants'
  | 'users'
  | 'tags'
  | 'categories';

export class SearchService {
  constructor(private repo: SearchRepository) {}

  async search(params: { q: string; type?: SearchType | null; limit?: number }) {
    const { q, type, limit = 10 } = params;

    if (!q) {
      throw ApiError.badRequest('Sokparameter "q" saknas eller ar ogiltig');
    }

    const search = `%${q}%`;
    const maxLimit = Math.min(Number(limit), 50);

    if (!type || type === 'all') {
      const [events, cities, restaurants, users, tags, categories] = await Promise.all([
        this.repo.searchEvents(search, maxLimit),
        this.repo.searchCities(search, maxLimit),
        this.repo.searchRestaurants(search, maxLimit),
        this.repo.searchUsers(search, maxLimit),
        this.repo.searchTags(search, maxLimit),
        this.repo.searchCategories(search, maxLimit),
      ]);

      return {
        type: 'all',
        results: {
          events,
          cities,
          restaurants,
          users,
          tags,
          categories,
        },
      };
    }

    switch (type) {
      case 'events':
        return { type: 'events', results: await this.repo.searchEvents(search, maxLimit) };
      case 'cities':
        return { type: 'cities', results: await this.repo.searchCities(search, maxLimit) };
      case 'restaurants':
        return { type: 'restaurants', results: await this.repo.searchRestaurants(search, maxLimit) };
      case 'users':
        return { type: 'users', results: await this.repo.searchUsers(search, maxLimit) };
      case 'tags':
        return { type: 'tags', results: await this.repo.searchTags(search, maxLimit) };
      case 'categories':
        return { type: 'categories', results: await this.repo.searchCategories(search, maxLimit) };
      default:
        throw ApiError.badRequest(
          'Ogiltig soktyp. Tillatna varden: all, events, cities, restaurants, users, tags, categories'
        );
    }
  }
}
