import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { TagService } from '../services/TagService.js';

export class TagController {
  constructor(private service: TagService) {}

  list = async (_req: Request, res: Response) => {
    const tags = await this.service.list();
    res.json(tags);
  };

  search = async (req: Request, res: Response) => {
    const { q } = req.query;

    if (!q) {
      return res.json([]);
    }

    const term = q.toString();
    const rows = await this.service.search(term);
    res.json(rows);
  };

  listByCategory = async (req: Request, res: Response) => {
    const categoryId = Number(req.params.categoryId);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw ApiError.badRequest('Ogiltigt kategori-ID', { categoryId });
    }

    const tags = await this.service.listByCategory(categoryId);
    res.json(tags);
  };
}
