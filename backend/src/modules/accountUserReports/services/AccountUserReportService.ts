import { ApiError } from '../../../shared/errors/ApiError.js';
import type { AccountUserReportRepository } from '../repositories/AccountUserReportRepository.js';

export class AccountUserReportService {
  constructor(private repo: AccountUserReportRepository) {}

  async resolveTarget(params: {
    legacyUserId?: number | null;
    name?: string | null;
    alias?: string | null;
  }) {
    const result = await this.repo.resolveTarget(params);
    if (!result) {
      throw ApiError.notFound('Anvandaren hittades inte');
    }
    return result;
  }

  async reportAccountUser(params: { userId: number; reason: string | null }) {
    const { userId, reason } = params;

    await this.repo.ensureUserReportsTable();
    await this.repo.createReport({ reportedAccountUserId: userId, reason });

    return {
      message: 'Anvandaren har rapporterats',
    };
  }

  async resolveReportTargetByUserId(userId: number): Promise<number> {
    const resolved = await this.repo.resolveReportTargetByUserId(userId);
    if (!resolved) {
      throw ApiError.notFound(
        'Anvandaren finns inte i account_users an. Anvandarens profil har mojligt inte synkats till det nya systemet.'
      );
    }
    return resolved;
  }
}