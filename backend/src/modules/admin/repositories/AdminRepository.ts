import type {
  AdminEventDetail,
  AdminEventListItem,
  AdminReportedEvent,
  AdminReportedUser,
} from '../domain/AdminTypes.js';

export interface AdminRepository {
  deleteUserWithReports(userId: number): Promise<{ clerkUserId: string | null } | null>;
  listEvents(): Promise<AdminEventListItem[]>;
  getEventById(eventId: number): Promise<AdminEventDetail | null>;
  deleteEvent(eventId: number): Promise<void>;
  deleteEventReport(reportId: number): Promise<number>;
  listReportedUsers(): Promise<AdminReportedUser[]>;
  deleteUserReport(reportId: number): Promise<number>;
  listReportedEvents(): Promise<AdminReportedEvent[]>;
}
