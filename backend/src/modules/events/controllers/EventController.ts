import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import type { EventService } from '../services/EventService.js';
import type { EventFilters } from '../dto/EventFilters.js';

function parseIds(param: any): number[] {
  if (!param) return [];
  if (Array.isArray(param)) return param.map(Number).filter(Boolean);
  return [Number(param)].filter(Boolean);
}

export class EventController {
  constructor(private service: EventService) {}

  list = async (req: Request, res: Response) => {
    const { category_ids, restaurant_id, city_ids, price_ids, date, order, tag_ids } = req.query;

    const filters: EventFilters = {
      categoryIds: parseIds(category_ids),
      restaurantId: restaurant_id ? Number(restaurant_id) : null,
      cityIds: parseIds(city_ids),
      priceIds: parseIds(price_ids),
      date: typeof date === 'string' ? date : null,
      order: typeof order === 'string' ? order : null,
      tagIds: parseIds(tag_ids),
    };

    const events = await this.service.listUpcoming(filters);
    res.json({ success: true, data: events });
  };

  getById = async (req: Request, res: Response) => {
    const id = res.locals.params.id as number;

    const event = await this.service.getById(id);
    res.json({ success: true, data: event });
  };

  listTags = async (req: Request, res: Response) => {
    const id = res.locals.params.id as number;

    const tags = await this.service.listTags(id);
    res.json({ success: true, data: tags });
  };

  report = async (req: Request, res: Response) => {
    const id = res.locals.params.id as number;
    const { reason } = req.body;

    const auth = getAuth(req);
    const clerkUserId = auth?.userId || undefined;

    const result = await this.service.reportEvent({
      eventId: id,
      reason: typeof reason === 'string' ? reason : null,
      clerkUserId,
    });

    return res.status(200).json({ success: true, data: result });
  };
}
