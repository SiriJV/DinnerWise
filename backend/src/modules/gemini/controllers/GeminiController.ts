import type { Request, Response } from 'express';
import { ApiError } from '../../../shared/errors/ApiError.js';
import type { GeminiService, GeminiContentType } from '../services/GeminiService.js';

export class GeminiController {
  constructor(private service: GeminiService) {}

  generateEventContent = async (req: Request, res: Response) => {
    try {
      const { prompt, type = 'event_description' } = req.body as {
        prompt: string;
        type?: GeminiContentType;
      };

      if (!prompt || prompt.trim().length === 0) {
        throw ApiError.badRequest('Prompt kravs');
      }

      const content = await this.service.generateContent(prompt, type);

      return res.json({
        success: true,
        data: { content },
      });
    } catch (error) {
      console.error('Gemini API error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      let statusCode = 500;
      let userErrorMessage = 'AI-genereringen misslyckades. Forsok igen senare.';
      let errorType = 'unknown';

      if (errorMessage.includes('429') || errorMessage.includes('too many requests')) {
        statusCode = 429;
        userErrorMessage = 'AI-tjansten ar overbelastad just nu. Forsok igen om nagra minuter.';
        errorType = 'high_demand';
      } else if (errorMessage.includes('quota') || errorMessage.includes('exceede')) {
        statusCode = 429;
        userErrorMessage = 'API-gransen har natts for idag. Forsok igen imorgon!';
        errorType = 'quota';
      } else if (
        errorMessage.includes('RESOURCE_EXHAUSTED') ||
        errorMessage.includes('currently experiencing high demand')
      ) {
        statusCode = 503;
        userErrorMessage = 'AI-tjansten ar valdigt belastad just nu. Forsok igen senare.';
        errorType = 'high_demand';
      } else if (errorMessage.includes('UNAUTHENTICATED')) {
        statusCode = 401;
        userErrorMessage = 'Autentiseringsfel med AI-tjansten.';
        errorType = 'server_error';
      }

      throw new ApiError(statusCode, 'AI_ERROR', userErrorMessage, { errorType });
    }
  };
}
