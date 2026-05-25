export interface UserRepository {
  list(): Promise<any[]>;
  search(term: string): Promise<any[]>;
  getByAlias(alias: string): Promise<any | null>;
  getById(id: number): Promise<any | null>;
}
