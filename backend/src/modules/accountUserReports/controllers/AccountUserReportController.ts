import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { AccountUserReportService } from '../services/AccountUserReportService.js';

export class AccountUserReportController {
  constructor(private service: AccountUserReportService) {}

  resolveTarget = async (req: Request, res: Response) => {
    const alias = typeof req.query.alias === 'string' ? req.query.alias.trim() : '';
    const legacyUserId = Number(req.query.legacyUserId);
    const name = typeof req.query.name === 'string' ? req.query.name.trim() : '';

    try {
      const result = await this.service.resolveTarget({
        legacyUserId,
        name: name || null,
        alias: alias || null,
      });

      return res.status(200).json({
        success: true,
        data: {
          accountUserId: result.accountUserId,
          source: result.source,
        },
      });
    } catch (error) {
      console.error('[user-report] resolve-target error:', error);
      throw ApiError.internal('Kunde inte hitta rapporterbar anvandare');
    }
  };

  reportUser = async (req: Request, res: Response) => {
    const incomingUserId = res.locals.params.userId as number;

    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim() : null;
    const normalizedReason = reason && reason.length > 0 ? reason : null;

    try {
      const resolvedAccountUserId = await this.service.resolveReportTargetByUserId(incomingUserId);

      const result = await this.service.reportAccountUser({
        userId: resolvedAccountUserId,
        reason: normalizedReason,
      });

      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      console.error('[user-report] SQL error:', error);
      throw ApiError.internal('Kunde inte rapportera anvandaren');
    }
  };
}