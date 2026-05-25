import type { Tag } from '../domain/Tag.js';

export interface TagRepository {
  list(): Promise<Tag[]>;
  search(term: string): Promise<Tag[]>;
  listByCategory(categoryId: number): Promise<Tag[]>;
}
