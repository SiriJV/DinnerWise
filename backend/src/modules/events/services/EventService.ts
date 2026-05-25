import { ApiError } from '../../../shared/errors/ApiError.js';
import type { EventFilters } from '../dto/EventFilters.js';
import type { EventRepository } from '../repositories/EventRepository.js';
import type { AccountUserService } from '../../accountUsers/services/AccountUserService.js';
import type { ClerkUserProvider } from './ClerkUserProvider.js';

export class EventService {
  constructor(
    private repo: EventRepository,
    private accountService: AccountUserService,
    private clerkProvider: ClerkUserProvider
  ) {}

  listUpcoming(filters: EventFilters) {
    return this.repo.listUpcoming(filters);
  }

  async getById(id: number) {
    const event = await this.repo.getById(id);
    if (!event) {
      throw ApiError.notFound('Event hittades inte', { id });
    }
    return event;
  }

  listTags(eventId: number) {
    return this.repo.listTags(eventId);
  }

  async reportEvent(params: { eventId: number; reason: string | null; clerkUserId?: string }) {
    const { eventId, reason, clerkUserId } = params;

    let reporterId: number | null = null;

    if (clerkUserId) {
      try {
        const profile = await this.clerkProvider.getUserProfile(clerkUserId);
        if (profile) {
          const account = await this.accountService.findOrCreateLocalAccount(
            clerkUserId,
            profile.email,
            profile.firstName,
            profile.lastName,
            profile.invitedRole
          );

          reporterId = account?.id ?? null;
        }
      } catch (error) {
        console.warn('Failed to resolve reporter:', error);
        reporterId = null;
      }
    }

    const exists = await this.repo.exists(eventId);
    if (!exists) {
      throw ApiError.notFound('Eventet hittades inte', { id: eventId });
    }

    if (reporterId !== null) {
      const hasReport = await this.repo.hasOpenReport(eventId, reporterId);
      if (hasReport) {
        return {
          message: 'Du har redan rapporterat detta event',
          isDuplicate: true,
        };
      }
    }

    try {
      await this.repo.createReport({ eventId, reporterId, reason });
      return {
        message: 'Eventet har rapporterats',
        isDuplicate: false,
      };
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        return {
          message: 'Du har redan rapporterat detta event',
          isDuplicate: true,
        };
      }
      throw err;
    }
  }
}
