export interface SearchRepository {
  searchEvents(term: string, limit: number): Promise<any[]>;
  searchCities(term: string, limit: number): Promise<any[]>;
  searchRestaurants(term: string, limit: number): Promise<any[]>;
  searchUsers(term: string, limit: number): Promise<any[]>;
  searchTags(term: string, limit: number): Promise<any[]>;
  searchCategories(term: string, limit: number): Promise<any[]>;
}
