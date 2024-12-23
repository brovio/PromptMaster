import { useState, useEffect } from 'react';
import { OpenRouterModel } from '../types/openrouter';
import { OpenRouterService } from '../lib/openrouter.service';
import { useApiKeys } from './useApiKeys';

export function useOpenRouter() {
  const { apiKeys, loading: apiKeysLoading } = useApiKeys();
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

  const apiKey = apiKeys.find(k => k.provider === 'openrouter')?.key_value;

  useEffect(() => {
    if (apiKeysLoading) return;
    if (!apiKey) {
      setLoading(false);
      return;
    }

    const fetchModels = async () => {
      try {
        setLoading(true);
        setError(null);
        const modelsList = await OpenRouterService.getModels(apiKey);
        setModels(modelsList);
      } catch (err) {
        setError('Failed to fetch models');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [apiKey, apiKeysLoading]);

  const refreshModels = async () => {
    if (!apiKey) return;
    try {
      setLoading(true);
      setError(null);
      const modelsList = await OpenRouterService.getModels(apiKey);
      setModels(modelsList);
    } catch (err) {
      setError('Failed to refresh models');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    models,
    loading: loading || apiKeysLoading,
    error,
    refreshModels,
    hasApiKey: !!apiKey,
    selectedProvider,
    selectedModel,
    setSelectedProvider,
    setSelectedModel
  };
}