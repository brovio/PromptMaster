import { apiRequest } from './api';
import { AppError } from './error';
import type { OpenRouterModel, OpenRouterModelsResponse } from '../types/openrouter';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterResponse {
  choices: Array<{ message: { content: string } }>;
  error?: {
    message: string;
    type: string;
  };
}

export class OpenRouterService {
  static async getModels(apiKey: string): Promise<OpenRouterModel[]> {
    if (!apiKey) {
      throw new AppError('API key is required');
    }

    try {
      const response = await apiRequest<OpenRouterModelsResponse>(
        `${OPENROUTER_API_URL}/models`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'PromptMaster'
          }
        }
      );

      if (!response?.data) {
        throw new AppError('Invalid response from OpenRouter API');
      }

      return response.data;
    } catch (error) {
      throw new AppError(
        'Failed to fetch models',
        'OPENROUTER_MODELS_ERROR',
        error
      );
    }
  }

  static async generateCompletion(apiKey: string, params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
  }): Promise<string> {
    if (!apiKey) {
      throw new AppError('API key is required');
    }

    try {
      const response = await apiRequest<OpenRouterResponse>(
        `${OPENROUTER_API_URL}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'PromptMaster'
          },
          body: params
        }
      );

      if (response.error) {
        throw new AppError(
          response.error.message,
          'OPENROUTER_API_ERROR',
          response.error
        );
      }

      if (!response.choices?.[0]?.message?.content) {
        throw new AppError('Invalid response format from OpenRouter API');
      }

      return response.choices[0].message.content;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Failed to generate completion',
        'OPENROUTER_COMPLETION_ERROR',
        error
      );
    }
  }
}