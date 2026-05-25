import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { UserService } from '../services/UserService.js';

export class UserController {
  constructor(private service: UserService) {}

  list = async (_req: Request, res: Response) => {
    const users = await this.service.list();
    res.json({ success: true, data: users });
  };

  search = async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const term = q.toString();
    const rows = await this.service.search(term);
    res.json({ success: true, data: rows });
  };

  getByAlias = async (req: Request, res: Response) => {
    const alias = Array.isArray(req.params.alias) ? req.params.alias[0] : req.params.alias;
    const user = await this.service.getByAlias(alias || '');
    res.json({ success: true, data: user });
  };

  getById = async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw ApiError.badRequest('Ogiltigt anvandar-ID', { userId });
    }

    const user = await this.service.getById(userId);
    res.json({ success: true, data: user });
  };
}
