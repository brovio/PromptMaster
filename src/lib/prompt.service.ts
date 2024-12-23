import { AppError } from './error';
import { OpenRouterService } from './openrouter.service';
import { enhancedQuery } from './supabase';

interface SavePromptParams {
  userId: string;
  content: string;
  modelId: string;
  templateId: string;
  result: string;
  metrics: {
    tokens: number;
    cost: number;
    time: number;
  };
  title?: string;
}

export class PromptService {
  static async improvePrompt(
    content: string, 
    modelId: string, 
    apiKey: string,
    systemPrompt: string
  ): Promise<string> {
    if (!content?.trim()) {
      throw new AppError('Prompt content is required');
    }

    if (!modelId) {
      throw new AppError('Model ID is required');
    }

    if (!apiKey) {
      throw new AppError('API key is required');
    }

    if (!systemPrompt) {
      throw new AppError('System prompt is required');
    }

    try {
      const response = await OpenRouterService.generateCompletion(apiKey, {
        model: modelId,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Original prompt: "${content}"`
          }
        ]
      });

      if (!response) {
        throw new AppError('No response from model');
      }

      return response;
    } catch (error) {
      console.error('Error improving prompt:', error);
      throw new AppError(
        'Failed to improve prompt',
        'PROMPT_IMPROVEMENT_ERROR',
        error
      );
    }
  }

  static async savePrompt({
    userId,
    content,
    modelId,
    templateId,
    result,
    metrics,
    title
  }: SavePromptParams) {
    if (!userId) {
      throw new AppError('User ID is required');
    }

    try {
      const { data, error } = await enhancedQuery
        .from('prompts')
        .insert({
          user_id: userId,
          title: title || content.slice(0, 50),
          content,
          model_id: modelId,
          template_id: templateId,
          result,
          tokens: metrics.tokens,
          cost: metrics.cost,
          processing_time: metrics.time,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving prompt:', error);
      throw new AppError(
        'Failed to save prompt',
        'PROMPT_SAVE_ERROR',
        error
      );
    }
  }
}