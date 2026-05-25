/**
 * Frontend API Configuration
 * 
 * Centralized API URL configuration.
 * All API calls should use this configuration.
 * 
 * Environment variables:
 * - VITE_API_URL: Backend API base URL (default: http://localhost:3001)
 */

// Get API URL from environment or use default
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export function unwrapApiResponse<T>(payload: ApiEnvelope<T>): T {
  return payload.data;
}

export function unwrapApiErrorMessage(payload: { error?: { message?: string } }): string | null {
  return payload?.error?.message ?? null;
}

/**
 * Build a full API endpoint URL
 * 
 * @example
 * getApiEndpoint('/events')                    // http://localhost:3001/events
 * getApiEndpoint('/events', '?limit=10')       // http://localhost:3001/events?limit=10
 */
export function getApiEndpoint(path: string, queryString?: string): string {
  return `${API_URL}${path}${queryString ? queryString : ''}`;
}

/**
 * Log API configuration for debugging
 */
export function logApiConfig(): void {
  const isDev = import.meta.env.DEV;
  console.log(`[API] Configuration: ${API_URL}${isDev ? ' (development mode)' : ' (production mode)'}`);
}
