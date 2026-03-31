const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface GenerateContentResponse {
  success: boolean;
  content: string;
  error?: string;
}

export const geminiApi = {
  generateEventContent: async (
    prompt: string,
    type: 'event_description' | 'event_title' | 'general' = 'event_description',
  ): Promise<GenerateContentResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/gemini/generate-event-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            type,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          content: '',
          error: data.error || `HTTP error! status: ${response.status}`,
        };
      }

      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Något gick fel',
      };
    }
  },
};
