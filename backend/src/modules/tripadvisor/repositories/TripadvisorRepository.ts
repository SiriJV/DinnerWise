import type { Restaurant } from '../../restaurants/domain/Restaurant.js';

export interface TripadvisorRepository {
  listRestaurants(): Promise<Restaurant[]>;
}
