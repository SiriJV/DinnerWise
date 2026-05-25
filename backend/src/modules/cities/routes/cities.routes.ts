import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlCityRepository } from '../repositories/MysqlCityRepository.js';
import { CityService } from '../services/CityService.js';
import { CityController } from '../controllers/CityController.js';

const router = Router();

const repo = new MysqlCityRepository();
const service = new CityService(repo);
const controller = new CityController(service);

router.get('/', asyncHandler(controller.list));
router.get('/search', asyncHandler(controller.search));

export default router;
