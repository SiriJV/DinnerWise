import type { TagRepository } from '../repositories/TagRepository.js';

export class TagService {
  constructor(private repo: TagRepository) {}

  list() {
    return this.repo.list();
  }

  search(term: string) {
    return this.repo.search(term);
  }

  listByCategory(categoryId: number) {
    return this.repo.listByCategory(categoryId);
  }
}
