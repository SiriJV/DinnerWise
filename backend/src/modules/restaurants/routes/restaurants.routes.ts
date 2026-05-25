import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlRestaurantRepository } from '../repositories/MysqlRestaurantRepository.js';
import { RestaurantService } from '../services/RestaurantService.js';
import { RestaurantController } from '../controllers/RestaurantController.js';
import { requirePositiveIntParam } from '../../../shared/validators/requestValidators.js';

const router = Router();

const repo = new MysqlRestaurantRepository();
const service = new RestaurantService(repo);
const controller = new RestaurantController(service);

router.get('/', asyncHandler(controller.list));
router.get('/search', asyncHandler(controller.search));
router.get(
	'/:id/events',
	requirePositiveIntParam('id', 'Ogiltigt restaurang-ID'),
	asyncHandler(controller.listEvents)
);
router.get(
	'/:id',
	requirePositiveIntParam('id', 'Ogiltigt restaurang-ID'),
	asyncHandler(controller.getById)
);

export default router;
