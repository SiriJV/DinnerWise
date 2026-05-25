export interface TripadvisorRepository {
  listRestaurants(): Promise<any[]>;
}
