import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { EmailService } from '../services/EmailService.js';
import { EmailController } from '../controllers/EmailController.js';

const router = Router();

const service = new EmailService();
const controller = new EmailController(service);

router.post('/send-welcome-email', controller.checkConfigured, asyncHandler(controller.sendWelcome));
router.post('/send-host-email', controller.checkConfigured, asyncHandler(controller.sendHost));
router.post(
  '/send-restaurant-booking-email',
  controller.checkConfigured,
  asyncHandler(controller.sendRestaurantBooking)
);
router.post(
  '/send-confirmation-email-to-host',
  controller.checkConfigured,
  asyncHandler(controller.sendConfirmationToHost)
);
router.post('/send-booking-email', controller.checkConfigured, asyncHandler(controller.sendBooking));
router.post(
  '/send-booking-email-to-host',
  controller.checkConfigured,
  asyncHandler(controller.sendBookingToHost)
);
router.post('/send-waitlist-email', controller.checkConfigured, asyncHandler(controller.sendWaitlist));
router.post(
  '/send-waitlist-email-to-host',
  controller.checkConfigured,
  asyncHandler(controller.sendWaitlistToHost)
);
router.post('/send-feedback-email', controller.checkConfigured, asyncHandler(controller.sendFeedback));
router.post('/send-share-email', controller.checkConfigured, asyncHandler(controller.sendShare));
router.post(
  '/send-newsletter-confirmation-email',
  controller.checkConfigured,
  asyncHandler(controller.sendNewsletterConfirmation)
);

export default router;
