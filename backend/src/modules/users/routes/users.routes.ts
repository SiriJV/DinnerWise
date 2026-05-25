import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlUserRepository } from '../repositories/MysqlUserRepository.js';
import { UserService } from '../services/UserService.js';
import { UserController } from '../controllers/UserController.js';

const router = Router();

const repo = new MysqlUserRepository();
const service = new UserService(repo);
const controller = new UserController(service);

router.get('/', asyncHandler(controller.list));
router.get('/search', asyncHandler(controller.search));
router.get('/alias/:alias', asyncHandler(controller.getByAlias));
router.get('/:id', asyncHandler(controller.getById));

export default router;
