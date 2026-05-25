import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlAdminRepository } from '../repositories/MysqlAdminRepository.js';
import { AdminService } from '../services/AdminService.js';
import { AdminController } from '../controllers/AdminController.js';
import { MysqlAccountUserRepository } from '../../accountUsers/repositories/MysqlAccountUserRepository.js';
import { AccountUserService } from '../../accountUsers/services/AccountUserService.js';
import { ClerkAdminProviderImpl } from '../services/ClerkAdminProviderImpl.js';
import { requirePositiveIntParam } from '../../../shared/validators/requestValidators.js';

const router = Router();

const repo = new MysqlAdminRepository();
const accountRepo = new MysqlAccountUserRepository();
const accountService = new AccountUserService(accountRepo);
const clerkProvider = new ClerkAdminProviderImpl();
const service = new AdminService(repo, accountService, clerkProvider);
const controller = new AdminController(service);

router.get('/users', asyncHandler(controller.listUsers));
router.delete(
	'/users/:userId',
	requirePositiveIntParam('userId', 'Ogiltigt anvandar-ID'),
	asyncHandler(controller.deleteUser)
);

router.get('/events', asyncHandler(controller.listEvents));
router.get(
	'/events/:eventId',
	requirePositiveIntParam('eventId', 'Ogiltigt event-ID'),
	asyncHandler(controller.getEvent)
);
router.delete(
	'/events/:eventId',
	requirePositiveIntParam('eventId', 'Ogiltigt event-ID'),
	asyncHandler(controller.deleteEvent)
);

router.delete(
	'/event-reports/:reportId',
	requirePositiveIntParam('reportId', 'Ogiltigt rapport-ID'),
	asyncHandler(controller.deleteEventReport)
);
router.get('/reported-users', asyncHandler(controller.listReportedUsers));
router.delete(
	'/user-reports/:reportId',
	requirePositiveIntParam('reportId', 'Ogiltigt rapport-ID'),
	asyncHandler(controller.deleteUserReport)
);

router.post('/invitations', asyncHandler(controller.sendInvitation));
router.get('/reported-events', asyncHandler(controller.listReportedEvents));

export default router;
