import type { CityRepository } from '../repositories/CityRepository.js';

export class CityService {
  constructor(private repo: CityRepository) {}

  list(search?: string | null) {
    return this.repo.list(search || null);
  }

  search(term: string) {
    return this.repo.search(term);
  }
}
