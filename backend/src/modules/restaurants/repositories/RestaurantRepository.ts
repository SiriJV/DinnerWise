export interface RestaurantRepository {
  list(city?: string | null): Promise<any[]>;
  search(term: string): Promise<any[]>;
  getById(id: number): Promise<any | null>;
  listEvents(restaurantId: number): Promise<any[]>;
}
