import type { Request, Response } from 'express';
import type { CategoryService } from '../services/CategoryService.js';

export class CategoryController {
  constructor(private service: CategoryService) {}

  list = async (_req: Request, res: Response) => {
    const categories = await this.service.list();
    res.json({ success: true, data: categories });
  };

  getById = async (req: Request, res: Response) => {
    const id = res.locals.params.id as number;

    const category = await this.service.getById(id);
    res.json({ success: true, data: category });
  };
}