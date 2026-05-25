import { GoogleGenerativeAI } from '@google/generative-ai';

export type GeminiContentType = 'event_description' | 'event_title' | 'general';

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  private getSystemPrompt(type: GeminiContentType) {
    if (type === 'event_description') {
      return `You are a helpful assistant for event hosts creating events set during dinners at restaurants. 
Based on the keywords or description provided, create a short, engaging, and marketable event description in Swedish.
The event is at a restaurant and in a group setting, where discussions led by a host, who is also the creator of the event, are central. The restaurant setting shouldn't be the focus, but it should be clear that it's a social event where the focus is on the theme of the event. Describe the theme and the kind of discussions that might happen, to attract potential participants.
Keep the description between 100-200 characters, making it appealing to potential participants.
Do not include any markdown formatting, just plain text.`;
    }

    if (type === 'event_title') {
      return `You are a helpful assistant for event hosts creating events set during dinners at restaurants.
Based on the keywords or description provided, create a short and catchy event title in Swedish.
Keep it to 5-10 words maximum.
Do not include any markdown formatting, just plain text.`;
    }

    return 'You are a helpful assistant. Respond helpfully and concisely.';
  }

  async generateContent(prompt: string, type: GeminiContentType) {
    const systemPrompt = this.getSystemPrompt(type);
    const model = this.ai.getGenerativeModel({ model: 'gemini-flash-latest' });

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

    return generatedText.trim();
  }
}
