export type AccountUserReportSource = 'legacy-id' | 'name' | 'alias-email';

export interface AccountUserReportTarget {
  accountUserId: number;
  source: AccountUserReportSource;
}