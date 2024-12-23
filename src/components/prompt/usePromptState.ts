import { useState, useCallback } from 'react';
import { AppError } from '../../lib/error';
import { PromptService } from '../../lib/prompt.service';
import type { User } from '@supabase/supabase-js';

interface PromptState {
  content: string;
  selectedModelId: string;
  selectedTemplateId: string;
  processing: boolean;
  error: string | null;
  metrics: {
    tokens: number;
    cost: number;
    time: number;
  } | null;
}

interface UsePromptStateProps {
  user: User | null;
  apiKey?: string;
  systemPrompt?: string;
  onTest?: (content: string) => void;
}

export function usePromptState({ 
  user, 
  apiKey,
  systemPrompt,
  onTest 
}: UsePromptStateProps) {
  const [state, setState] = useState<PromptState>({
    content: '',
    selectedModelId: '',
    selectedTemplateId: 'general',
    processing: false,
    error: null,
    metrics: null
  });

  const setContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }));
  }, []);

  const setSelectedModelId = useCallback((modelId: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedModelId: modelId,
      error: null 
    }));
  }, []);

  const setSelectedTemplateId = useCallback((templateId: string) => {
    setState(prev => ({ 
      ...prev, 
      selectedTemplateId: templateId,
      error: null 
    }));
  }, []);

  const validateInputs = useCallback(() => {
    if (!state.content.trim()) {
      throw new AppError('Please enter a prompt');
    }
    if (!state.selectedModelId) {
      throw new AppError('Please select a model');
    }
    if (!state.selectedTemplateId) {
      throw new AppError('Please select a template');
    }
    if (!user) {
      throw new AppError('Please sign in to continue');
    }
    if (!apiKey) {
      throw new AppError('API key not found. Please add your API key in settings');
    }
    if (!systemPrompt) {
      throw new AppError('Template system prompt not found');
    }
  }, [state, user, apiKey, systemPrompt]);

  const handleRun = useCallback(async () => {
    try {
      validateInputs();
      
      setState(prev => ({ ...prev, processing: true, error: null }));
      const startTime = Date.now();

      const improvedContent = await PromptService.improvePrompt(
        state.content,
        state.selectedModelId,
        apiKey!,
        systemPrompt!
      );

      const newMetrics = {
        tokens: Math.round(state.content.length / 4),
        cost: 0.000001 * Math.round(state.content.length / 4),
        time: (Date.now() - startTime) / 1000
      };

      await PromptService.savePrompt({
        userId: user!.id,
        content: state.content,
        modelId: state.selectedModelId,
        templateId: state.selectedTemplateId,
        result: improvedContent,
        metrics: newMetrics
      });

      setState(prev => ({ ...prev, metrics: newMetrics }));
      onTest?.(improvedContent);
    } catch (err) {
      console.error('Error processing prompt:', err);
      setState(prev => ({ 
        ...prev, 
        error: err instanceof AppError ? err.message : 'Failed to process prompt'
      }));
    } finally {
      setState(prev => ({ ...prev, processing: false }));
    }
  }, [state, user, apiKey, systemPrompt, onTest, validateInputs]);

  return {
    state,
    setContent,
    setSelectedModelId,
    setSelectedTemplateId,
    handleRun
  };
}