import { Router } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { GeminiService } from '../services/GeminiService.js';
import { GeminiController } from '../controllers/GeminiController.js';

const router = Router();

const apiKey = process.env.GEMINI_API_KEY || '';
const service = new GeminiService(apiKey);
const controller = new GeminiController(service);

router.post('/generate-event-content', asyncHandler(controller.generateEventContent));

export default router;
