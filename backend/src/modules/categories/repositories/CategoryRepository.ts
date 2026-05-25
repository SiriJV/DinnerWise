import type { Category } from '../domain/Category.js';

export interface CategoryRepository {
  list(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
}