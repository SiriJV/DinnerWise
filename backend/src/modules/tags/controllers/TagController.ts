import type { Request, Response } from 'express';
import type { TagService } from '../services/TagService.js';

export class TagController {
  constructor(private service: TagService) {}

  list = async (_req: Request, res: Response) => {
    const tags = await this.service.list();
    res.json({ success: true, data: tags });
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

  listByCategory = async (req: Request, res: Response) => {
    const categoryId = res.locals.params.categoryId as number;

    const tags = await this.service.listByCategory(categoryId);
    res.json({ success: true, data: tags });
  };
}