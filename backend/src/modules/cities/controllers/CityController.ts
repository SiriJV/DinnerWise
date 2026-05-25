import type { Request, Response } from 'express';
import type { CityService } from '../services/CityService.js';

export class CityController {
  constructor(private service: CityService) {}

  list = async (req: Request, res: Response) => {
    const q = (req.query.q as string | undefined)?.toLowerCase();
    const rows = await this.service.list(q || null);
    res.json({ success: true, data: rows });
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
}
