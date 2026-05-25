import { ApiError } from '../../../shared/errors/ApiError.js';
import type { CategoryRepository } from '../repositories/CategoryRepository.js';

export class CategoryService {
  constructor(private repo: CategoryRepository) {}

  list() {
    return this.repo.list();
  }

  async getById(id: number) {
    const category = await this.repo.getById(id);
    if (!category) {
      throw ApiError.notFound('Kategori hittades inte', { id });
    }
    return category;
  }
}
