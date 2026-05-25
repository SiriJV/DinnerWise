export interface CityRepository {
  list(search?: string | null): Promise<any[]>;
  search(term: string): Promise<any[]>;
}
