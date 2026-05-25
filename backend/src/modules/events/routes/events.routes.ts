import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlEventRepository } from '../repositories/MysqlEventRepository.js';
import { EventService } from '../services/EventService.js';
import { EventController } from '../controllers/EventController.js';
import { MysqlAccountUserRepository } from '../../accountUsers/repositories/MysqlAccountUserRepository.js';
import { AccountUserService } from '../../accountUsers/services/AccountUserService.js';
import { ClerkUserProviderImpl } from '../services/ClerkUserProviderImpl.js';

const router = Router();

const eventRepo = new MysqlEventRepository();
const accountRepo = new MysqlAccountUserRepository();
const accountService = new AccountUserService(accountRepo);
const clerkProvider = new ClerkUserProviderImpl();
const eventService = new EventService(eventRepo, accountService, clerkProvider);
const controller = new EventController(eventService);

router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.get('/:id/tags', asyncHandler(controller.listTags));
router.post('/:id/report', asyncHandler(controller.report));

export default router;
