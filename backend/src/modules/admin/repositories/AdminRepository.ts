export interface AdminRepository {
  deleteUserWithReports(userId: number): Promise<{ clerkUserId: string | null } | null>;
  listEvents(): Promise<any[]>;
  getEventById(eventId: number): Promise<any | null>;
  deleteEvent(eventId: number): Promise<void>;
  deleteEventReport(reportId: number): Promise<number>;
  listReportedUsers(): Promise<any[]>;
  deleteUserReport(reportId: number): Promise<number>;
  listReportedEvents(): Promise<any[]>;
}
