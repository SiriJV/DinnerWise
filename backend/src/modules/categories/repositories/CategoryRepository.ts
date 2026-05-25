export interface CategoryRepository {
  list(): Promise<any[]>;
  getById(id: number): Promise<any | null>;
}
