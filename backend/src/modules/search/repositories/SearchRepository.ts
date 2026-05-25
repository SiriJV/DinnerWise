import type {
  SearchCategory,
  SearchCity,
  SearchEvent,
  SearchRestaurant,
  SearchTag,
  SearchUser,
} from '../domain/SearchResults.js';

export interface SearchRepository {
  searchEvents(term: string, limit: number): Promise<SearchEvent[]>;
  searchCities(term: string, limit: number): Promise<SearchCity[]>;
  searchRestaurants(term: string, limit: number): Promise<SearchRestaurant[]>;
  searchUsers(term: string, limit: number): Promise<SearchUser[]>;
  searchTags(term: string, limit: number): Promise<SearchTag[]>;
  searchCategories(term: string, limit: number): Promise<SearchCategory[]>;
}
