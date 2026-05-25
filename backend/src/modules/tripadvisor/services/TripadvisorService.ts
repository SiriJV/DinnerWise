import type { TripadvisorRepository } from '../repositories/TripadvisorRepository.js';

export class TripadvisorService {
  constructor(private repo: TripadvisorRepository) {}

  listRestaurants() {
    return this.repo.listRestaurants();
  }
}
