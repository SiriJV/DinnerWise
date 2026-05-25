import type { UserProfile } from '../domain/UserProfile.js';

export interface UserRepository {
  list(): Promise<UserProfile[]>;
  search(term: string): Promise<UserProfile[]>;
  getByAlias(alias: string): Promise<UserProfile | null>;
  getById(id: number): Promise<UserProfile | null>;
}