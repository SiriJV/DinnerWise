import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { CategoryService } from '../services/CategoryService.js';

export class CategoryController {
  constructor(private service: CategoryService) {}

  list = async (_req: Request, res: Response) => {
    const categories = await this.service.list();
    res.json(categories);
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw ApiError.badRequest('Ogiltigt kategori-ID', { id });
    }

    const category = await this.service.getById(id);
    res.json(category);
  };
}
