export interface TagRepository {
  list(): Promise<any[]>;
  search(term: string): Promise<any[]>;
  listByCategory(categoryId: number): Promise<any[]>;
}
