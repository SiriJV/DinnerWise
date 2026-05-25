import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { MysqlAccountUserReportRepository } from '../repositories/MysqlAccountUserReportRepository.js';
import { AccountUserReportService } from '../services/AccountUserReportService.js';
import { AccountUserReportController } from '../controllers/AccountUserReportController.js';

const router = Router();

const repo = new MysqlAccountUserReportRepository();
const service = new AccountUserReportService(repo);
const controller = new AccountUserReportController(service);

router.get('/resolve-target', asyncHandler(controller.resolveTarget));
router.post('/:userId/report', asyncHandler(controller.reportUser));

export default router;