import type { EventListItem } from '../../events/domain/EventListItem.js';
import type { Restaurant } from '../domain/Restaurant.js';

export interface RestaurantRepository {
  list(city?: string | null): Promise<Restaurant[]>;
  search(term: string): Promise<Restaurant[]>;
  getById(id: number): Promise<Restaurant | null>;
  listEvents(restaurantId: number): Promise<EventListItem[]>;
}
