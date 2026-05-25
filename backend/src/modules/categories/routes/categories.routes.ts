import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlCategoryRepository } from '../repositories/MysqlCategoryRepository.js';
import { CategoryService } from '../services/CategoryService.js';
import { CategoryController } from '../controllers/CategoryController.js';

const router = Router();

const repo = new MysqlCategoryRepository();
const service = new CategoryService(repo);
const controller = new CategoryController(service);

router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));

export default router;
