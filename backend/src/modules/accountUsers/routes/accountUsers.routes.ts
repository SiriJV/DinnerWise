import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlAccountUserRepository } from '../repositories/MysqlAccountUserRepository.js';
import { AccountUserService } from '../services/AccountUserService.js';
import { AccountUserController } from '../controllers/AccountUserController.js';

const router = Router();

const repo = new MysqlAccountUserRepository();
const service = new AccountUserService(repo);
const controller = new AccountUserController(service);

router.get('/me', asyncHandler(controller.getMe));
router.delete('/me', asyncHandler(controller.deleteMe));

export default router;