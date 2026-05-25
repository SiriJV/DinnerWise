import { API_URL, unwrapApiResponse, unwrapApiErrorMessage } from './config';

const REQUEST_TIMEOUT = 60000;

interface GenerateContentResponse {
  success: boolean;
  content: string;
  error?: string;
  errorType?:
    | 'timeout'
    | 'quota'
    | 'high_demand'
    | 'server_error'
    | 'network'
    | 'unknown';
}

// const timeoutPromise = (ms: number): Promise<never> => {
//   return new Promise((_, reject) => {
//     setTimeout(() => {
//       reject(new Error('timeout'));
//     }, ms);
//   });
// };

export const geminiApi = {
  generateEventContent: async (
    prompt: string,
    type: 'event_description' | 'event_title' | 'general' = 'event_description',
  ): Promise<GenerateContentResponse> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await fetch(
        `${API_URL}/gemini/generate-event-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            type,
          }),
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          content: '',
          error: unwrapApiErrorMessage(data) || `HTTP error! status: ${response.status}`,
          errorType: data.error?.details?.errorType || 'server_error',
        };
      }

      const result = unwrapApiResponse<{ content: string }>(data);
      return {
        success: true,
        content: result?.content || '',
      };
    } catch (error) {
      console.error('Error generating content:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError' || error.message === 'timeout') {
          return {
            success: false,
            content: '',
            error: 'AI-genereringen tog för lång tid. Försök igen senare.',
            errorType: 'timeout',
          };
        }
        return {
          success: false,
          content: '',
          error: error.message !== 'timeout' ? error.message : 'Något gick fel',
          errorType: 'network',
        };
      }

      return {
        success: false,
        content: '',
        error: 'Något gick fel med AI-genereringen',
        errorType: 'unknown',
      };
    }
  },
};
