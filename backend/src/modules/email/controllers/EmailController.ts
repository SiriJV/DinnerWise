import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { EmailService } from '../services/EmailService.js';

export class EmailController {
  constructor(private service: EmailService) {}

  checkConfigured = (_req: Request, _res: Response, next: NextFunction) => {
    if (!this.service.isConfigured()) {
      return next(
        ApiError.serviceUnavailable(
          'E-posttjansten ar inte konfigurerad. Ange RESEND_API_KEY i .env'
        )
      );
    }
    return next();
  };

  sendWelcome = async (req: Request, res: Response) => {
    const result = await this.service.sendWelcomeEmail(req.body);
    res.json(result);
  };

  sendHost = async (req: Request, res: Response) => {
    const result = await this.service.sendHostEmail(req.body);
    res.json(result);
  };

  sendRestaurantBooking = async (req: Request, res: Response) => {
    const result = await this.service.sendRestaurantBookingEmail(req.body);
    res.json(result);
  };

  sendConfirmationToHost = async (req: Request, res: Response) => {
    const result = await this.service.sendConfirmationEmailToHost(req.body);
    res.json(result);
  };

  sendBooking = async (req: Request, res: Response) => {
    const result = await this.service.sendBookingEmail(req.body);
    res.json(result);
  };

  sendBookingToHost = async (req: Request, res: Response) => {
    const result = await this.service.sendBookingEmailToHost(req.body);
    res.json(result);
  };

  sendWaitlist = async (req: Request, res: Response) => {
    const result = await this.service.sendWaitlistEmail(req.body);
    res.json(result);
  };

  sendWaitlistToHost = async (req: Request, res: Response) => {
    const result = await this.service.sendWaitlistEmailToHost(req.body);
    res.json(result);
  };

  sendFeedback = async (req: Request, res: Response) => {
    const result = await this.service.sendFeedbackEmail(req.body);
    res.json(result);
  };

  sendShare = async (req: Request, res: Response) => {
    const result = await this.service.sendShareEmail(req.body);
    res.json(result);
  };

  sendNewsletterConfirmation = async (req: Request, res: Response) => {
    const result = await this.service.sendNewsletterConfirmationEmail(req.body);
    res.json(result);
  };
}
