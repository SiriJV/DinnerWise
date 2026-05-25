import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlTagRepository } from '../repositories/MysqlTagRepository.js';
import { TagService } from '../services/TagService.js';
import { TagController } from '../controllers/TagController.js';
import { requirePositiveIntParam } from '../../../shared/validators/requestValidators.js';

const router = Router();

const repo = new MysqlTagRepository();
const service = new TagService(repo);
const controller = new TagController(service);

router.get('/', asyncHandler(controller.list));
router.get('/search', asyncHandler(controller.search));
router.get(
	'/category/:categoryId',
	requirePositiveIntParam('categoryId', 'Ogiltigt kategori-ID'),
	asyncHandler(controller.listByCategory)
);

export default router;
