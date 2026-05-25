import type { City } from '../domain/City.js';

export interface CityRepository {
  list(search?: string | null): Promise<City[]>;
  search(term: string): Promise<City[]>;
}
