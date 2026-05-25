import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlTripadvisorRepository } from '../repositories/MysqlTripadvisorRepository.js';
import { TripadvisorService } from '../services/TripadvisorService.js';
import { TripadvisorController } from '../controllers/TripadvisorController.js';

const router = Router();

const repo = new MysqlTripadvisorRepository();
const service = new TripadvisorService(repo);
const controller = new TripadvisorController(service);

router.get('/restaurants', asyncHandler(controller.listRestaurants));

export default router;
