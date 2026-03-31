import express, { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenerativeAI(apiKey);

interface GenerateContentRequest extends Request {
  body: {
    prompt: string;
    type?: 'event_description' | 'event_title' | 'general';
  };
}

router.post(
  '/generate-event-content',
  async (req: GenerateContentRequest, res: Response) => {
    try {
      const { prompt, type = 'event_description' } = req.body;

      if (!prompt || prompt.trim().length === 0) {
        res.status(400).json({ error: 'Prompt is required' });
        return;
      }

      let systemPrompt = '';

      if (type === 'event_description') {
        systemPrompt = `You are a helpful assistant for event hosts creating restaurant events. 
Based on the keywords or description provided, create a short, engaging, and marketable event description in Swedish.
The event is at a restaurant and in a group setting, where discussions led by a host, who is also the creator of the event, are central. The restaurant setting shouldn't be the focus, but it should be clear that it's a social event where the focus is on the theme of the event.
Keep the description between 100-200 characters, making it appealing to potential participants.
Do not include any markdown formatting, just plain text.`;
      } else if (type === 'event_title') {
        systemPrompt = `You are a helpful assistant for event hosts creating restaurant events.
Based on the keywords or description provided, create a short and catchy event title in Swedish.
Keep it to 5-10 words maximum.
Do not include any markdown formatting, just plain text.`;
      } else {
        systemPrompt = `You are a helpful assistant. Respond helpfully and concisely.`;
      }

      const model = ai.getGenerativeModel({ model: 'gemini-flash-latest' });
      const response = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: systemPrompt + '\n\nUser input: ' + prompt,
              },
            ],
          },
        ],
      });

      const generatedText = response.response.text() || '';

      res.json({
        success: true,
        content: generatedText.trim(),
      });
    } catch (error) {
      console.error('Gemini API error:', error);

      // Check if it's a quota exceeded error
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const isQuotaExceeded =
        errorMessage.includes('429') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('exceede');

      res.status(isQuotaExceeded ? 429 : 500).json({
        error: isQuotaExceeded
          ? 'API-gränsen har nåtts för idag. Försök igen imorgon!'
          : 'Failed to generate content',
        message: errorMessage,
      });
    }
  },
);

export default router;
