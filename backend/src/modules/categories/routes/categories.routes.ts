import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlCategoryRepository } from '../repositories/MysqlCategoryRepository.js';
import { CategoryService } from '../services/CategoryService.js';
import { CategoryController } from '../controllers/CategoryController.js';
import { requirePositiveIntParam } from '../../../shared/validators/requestValidators.js';

const router = Router();

const repo = new MysqlCategoryRepository();
const service = new CategoryService(repo);
const controller = new CategoryController(service);

router.get('/', asyncHandler(controller.list));
router.get(
	'/:id',
	requirePositiveIntParam('id', 'Ogiltigt kategori-ID'),
	asyncHandler(controller.getById)
);

export default router;
