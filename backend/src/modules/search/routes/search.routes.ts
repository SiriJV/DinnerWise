import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlSearchRepository } from '../repositories/MysqlSearchRepository.js';
import { SearchService } from '../services/SearchService.js';
import { SearchController } from '../controllers/SearchController.js';

const router = Router();

const repo = new MysqlSearchRepository();
const service = new SearchService(repo);
const controller = new SearchController(service);

router.get('/', asyncHandler(controller.search));

export default router;
