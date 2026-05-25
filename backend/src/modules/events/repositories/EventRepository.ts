import type { EventFilters } from '../dto/EventFilters.js';
import type { EventListItem } from '../domain/EventListItem.js';
import type { EventTag } from '../domain/EventTag.js';

export interface EventRepository {
  listUpcoming(filters: EventFilters): Promise<EventListItem[]>;
  getById(id: number): Promise<EventListItem | null>;
  listTags(eventId: number): Promise<EventTag[]>;
  exists(eventId: number): Promise<boolean>;
  hasOpenReport(eventId: number, reporterId: number): Promise<boolean>;
  createReport(params: {
    eventId: number;
    reporterId: number | null;
    reason: string | null;
  }): Promise<void>;
}
