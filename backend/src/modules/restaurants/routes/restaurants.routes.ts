import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlRestaurantRepository } from '../repositories/MysqlRestaurantRepository.js';
import { RestaurantService } from '../services/RestaurantService.js';
import { RestaurantController } from '../controllers/RestaurantController.js';

const router = Router();

const repo = new MysqlRestaurantRepository();
const service = new RestaurantService(repo);
const controller = new RestaurantController(service);

router.get('/', asyncHandler(controller.list));
router.get('/search', asyncHandler(controller.search));
router.get('/:id/events', asyncHandler(controller.listEvents));
router.get('/:id', asyncHandler(controller.getById));

export default router;
