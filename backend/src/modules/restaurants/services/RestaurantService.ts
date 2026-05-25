import { ApiError } from '../../../shared/errors/ApiError.js';
import type { RestaurantRepository } from '../repositories/RestaurantRepository.js';

export class RestaurantService {
  constructor(private repo: RestaurantRepository) {}

  list(city?: string | null) {
    return this.repo.list(city || null);
  }

  search(term: string) {
    return this.repo.search(term);
  }

  listEvents(restaurantId: number) {
    return this.repo.listEvents(restaurantId);
  }

  async getById(id: number) {
    const restaurant = await this.repo.getById(id);
    if (!restaurant) {
      throw ApiError.notFound('Restaurang hittades inte', { id });
    }
    return restaurant;
  }
}
