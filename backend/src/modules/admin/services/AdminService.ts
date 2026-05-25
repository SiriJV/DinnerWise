import { ApiError } from '../../../shared/errors/ApiError.js';
import type { AdminRepository } from '../repositories/AdminRepository.js';
import type { AccountUserService } from '../../accountUsers/services/AccountUserService.js';
import type { AdminClerkProvider } from './AdminClerkProvider.js';

export class AdminService {
  constructor(
    private repo: AdminRepository,
    private accountService: AccountUserService,
    private clerkProvider: AdminClerkProvider
  ) {}

  async resolveAdmin(clerkUserId: string) {
    const profile = await this.clerkProvider.getUserProfile(clerkUserId);

    const account = await this.accountService.findOrCreateLocalAccount(
      clerkUserId,
      profile.email,
      profile.firstName,
      profile.lastName,
      profile.invitedRole
    );

    if (!account) {
      throw ApiError.unauthorized('Inte inloggad');
    }

    if (account.role !== 'admin') {
      throw ApiError.forbidden('Du har inte behorighet');
    }

    return account;
  }

  listUsers() {
    return this.accountService.getAllAccounts();
  }

  async deleteUser(params: { userId: number; adminId: number }) {
    const { userId, adminId } = params;

    if (userId === adminId) {
      throw ApiError.forbidden('Du kan inte ta bort dig sjalv');
    }

    const deleted = await this.repo.deleteUserWithReports(userId);
    if (!deleted) {
      throw ApiError.notFound('Anvandaren hittades inte', { userId });
    }

    if (deleted.clerkUserId) {
      try {
        await this.clerkProvider.deleteUser(deleted.clerkUserId);
      } catch (clerkError) {
        console.warn('Unable to delete Clerk user:', clerkError);
      }
    }

    return {
      success: true,
      message: 'Anvandaren har tagits bort',
    };
  }

  listEvents() {
    return this.repo.listEvents();
  }

  async getEvent(eventId: number) {
    const event = await this.repo.getEventById(eventId);
    if (!event) {
      throw ApiError.notFound('Eventet hittades inte', { eventId });
    }
    return event;
  }

  async deleteEvent(eventId: number) {
    try {
      await this.repo.deleteEvent(eventId);
    } catch (error: any) {
      if (error?.message === 'NOT_FOUND') {
        throw ApiError.notFound('Eventet hittades inte', { eventId });
      }
      throw ApiError.internal('Kunde inte ta bort eventet');
    }

    return { success: true, message: 'Eventet har tagits bort' };
  }

  async deleteEventReport(reportId: number) {
    const deletedRows = await this.repo.deleteEventReport(reportId);
    if (deletedRows === 0) {
      throw ApiError.notFound('Rapporten hittades inte', { reportId });
    }

    return { success: true, message: 'Rapporten har avfardats' };
  }

  async listReportedUsers() {
    try {
      return await this.repo.listReportedUsers();
    } catch (error: any) {
      if (error?.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }
      throw ApiError.internal('Kunde inte hamta rapporterade anvandare');
    }
  }

  async deleteUserReport(reportId: number) {
    const deletedRows = await this.repo.deleteUserReport(reportId);
    if (deletedRows === 0) {
      throw ApiError.notFound('Rapporten hittades inte', { reportId });
    }

    return { success: true, message: 'Rapporten har avfardats' };
  }

  async sendInvitation(emailAddress: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailAddress || typeof emailAddress !== 'string') {
      throw ApiError.badRequest('E-postadress kravs');
    }

    if (!emailRegex.test(emailAddress)) {
      throw ApiError.badRequest('Ogiltig e-postadress');
    }

    try {
      const redirectUrl = 'http://localhost:5173/accept-invitation';
      const invitation = await this.clerkProvider.createInvitation({
        emailAddress,
        redirectUrl,
      });

      return {
        success: true,
        message: `Inbjudan skickad till ${emailAddress}`,
        invitation: {
          id: invitation.id,
          email: emailAddress,
          status: invitation.status,
        },
      };
    } catch (error: any) {
      if (error?.errors) {
        const clerkErrors = error.errors;
        for (const e of clerkErrors) {
          if (e.code === 'duplicate_record' || e.message?.includes('already')) {
            throw ApiError.conflict(
              'En inbjudan har redan skickats till denna e-postadress, eller sa finns anvandaren redan'
            );
          }
        }
      }

      if (error?.message?.includes('already')) {
        throw ApiError.conflict(
          'En inbjudan har redan skickats till denna e-postadress, eller sa finns anvandaren redan'
        );
      }

      throw ApiError.internal('Kunde inte skicka inbjudan');
    }
  }

  async listReportedEvents() {
    try {
      return await this.repo.listReportedEvents();
    } catch (error: any) {
      if (error?.code === 'ER_NO_SUCH_TABLE') {
        return [];
      }

      throw ApiError.internal('Kunde inte hamta rapporterade events');
    }
  }
}
