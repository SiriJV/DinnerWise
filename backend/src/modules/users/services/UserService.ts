import { ApiError } from '../../../shared/errors/ApiError.js';
import type { UserRepository } from '../repositories/UserRepository.js';

export class UserService {
  constructor(private repo: UserRepository) {}

  list() {
    return this.repo.list();
  }

  search(term: string) {
    return this.repo.search(term);
  }

  async getByAlias(alias: string) {
    const user = await this.repo.getByAlias(alias);
    if (!user) {
      throw ApiError.notFound('Anvandare hittades inte', { alias });
    }
    return user;
  }

  async getById(id: number) {
    const user = await this.repo.getById(id);
    if (!user) {
      throw ApiError.notFound('Anvandare hittades inte', { id });
    }
    return user;
  }
}
