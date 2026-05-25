import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { TripadvisorService } from '../services/TripadvisorService.js';

export class TripadvisorController {
  constructor(private service: TripadvisorService) {}

  listRestaurants = async (_req: Request, res: Response) => {
    try {
      const rows = await this.service.listRestaurants();
      res.json(rows);
    } catch (err: any) {
      console.error('Tripadvisor fetch failed:', err);
      throw ApiError.internal('Hamtnings misslyckades');
    }
  };
}
