import type { Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { AdminService } from '../services/AdminService.js';

export class AdminController {
  constructor(private service: AdminService) {}

  private async resolveAdmin(req: Request) {
    const auth = getAuth(req);
    const clerkUserId = auth?.userId;

    if (!clerkUserId) {
      throw ApiError.unauthorized('Inte inloggad');
    }

    return this.service.resolveAdmin(clerkUserId);
  }

  listUsers = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);
    const users = await this.service.listUsers();
    return res.json(users);
  };

  deleteUser = async (req: Request, res: Response) => {
    const admin = await this.resolveAdmin(req);

    const userId = Number(req.params.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw ApiError.badRequest('Ogiltigt anvandar-ID', { userId });
    }

    const result = await this.service.deleteUser({ userId, adminId: admin.id });
    return res.status(200).json(result);
  };

  listEvents = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);
    const rows = await this.service.listEvents();
    return res.json(rows);
  };

  getEvent = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);

    const eventId = Number(req.params.eventId);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      throw ApiError.badRequest('Ogiltigt event-ID', { eventId });
    }

    const event = await this.service.getEvent(eventId);
    return res.status(200).json(event);
  };

  deleteEvent = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);

    const eventId = Number(req.params.eventId);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      throw ApiError.badRequest('Ogiltigt event-ID', { eventId });
    }

    const result = await this.service.deleteEvent(eventId);
    return res.status(200).json(result);
  };

  deleteEventReport = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);

    const reportId = Number(req.params.reportId);
    if (!Number.isInteger(reportId) || reportId <= 0) {
      throw ApiError.badRequest('Ogiltigt rapport-ID', { reportId });
    }

    const result = await this.service.deleteEventReport(reportId);
    return res.status(200).json(result);
  };

  listReportedUsers = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);
    const reports = await this.service.listReportedUsers();
    return res.status(200).json(reports);
  };

  deleteUserReport = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);

    const reportId = Number(req.params.reportId);
    if (!Number.isInteger(reportId) || reportId <= 0) {
      throw ApiError.badRequest('Ogiltigt rapport-ID', { reportId });
    }

    const result = await this.service.deleteUserReport(reportId);
    return res.status(200).json(result);
  };

  sendInvitation = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);

    const { emailAddress } = req.body;
    const result = await this.service.sendInvitation(emailAddress);
    return res.json(result);
  };

  listReportedEvents = async (req: Request, res: Response) => {
    await this.resolveAdmin(req);
    const reports = await this.service.listReportedEvents();
    return res.status(200).json(reports);
  };
}
