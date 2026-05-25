export interface AccountUserReportRepository {
  resolveTarget(params: {
    legacyUserId?: number | null;
    name?: string | null;
    alias?: string | null;
  }): Promise<{ accountUserId: number; source: string } | null>;
  resolveReportTargetByUserId(userId: number): Promise<number | null>;
  ensureUserReportsTable(): Promise<void>;
  createReport(params: { reportedAccountUserId: number; reason: string | null }): Promise<void>;
}