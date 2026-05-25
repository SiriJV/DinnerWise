import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { SearchService } from '../services/SearchService.js';

export class SearchController {
  constructor(private service: SearchService) {}

  search = async (req: Request, res: Response) => {
    const { q, type, limit = 10 } = req.query;

    if (!q || typeof q !== 'string') {
      throw ApiError.badRequest('Sokparameter "q" saknas eller ar ogiltig');
    }

    try {
      const result = await this.service.search({
        q,
        type: typeof type === 'string' ? (type as any) : undefined,
        limit: Number(limit),
      });
      return res.json(result);
    } catch (error) {
      console.error('[search] query error:', error);
      throw ApiError.internal('Kunde inte genomfora sokningen');
    }
  };
}
