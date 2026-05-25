import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { RestaurantService } from '../services/RestaurantService.js';

export class RestaurantController {
  constructor(private service: RestaurantService) {}

  list = async (req: Request, res: Response) => {
    const city = req.query.city as string | undefined;
    const rows = await this.service.list(city);
    res.json(rows);
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

  listEvents = async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.id);
    if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
      throw ApiError.badRequest('Ogiltigt restaurang-ID', { restaurantId });
    }

    const events = await this.service.listEvents(restaurantId);
    res.json(events);
  };

  getById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw ApiError.badRequest('Ogiltigt restaurang-ID', { id });
    }

    const restaurant = await this.service.getById(id);
    res.json(restaurant);
  };
}
