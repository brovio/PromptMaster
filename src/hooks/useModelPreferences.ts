import { useState, useEffect } from 'react';
import { enhancedQuery } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import type { ModelPreference } from '../types/openrouter';
import { AppError } from '../lib/error';

export function useModelPreferences() {
  const { user } = useAuth();
  const [models, setModels] = useState<ModelPreference[]>(() => storage.getModelPreferences());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await enhancedQuery
          .from('model_preferences')
          .select('*');

        if (fetchError) throw fetchError;

        const preferences = data?.map(item => ({
          id: item.id,
          modelId: item.model_id,
          provider: item.provider,
          isEnabled: item.is_enabled,
          priority: item.priority,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) || [];

        setModels(preferences);
        storage.setModelPreferences(preferences);
      } catch (err) {
        console.error('Error fetching model preferences:', err);
        setError('Failed to load model preferences');
        
        // Fall back to cached preferences
        const cachedPreferences = storage.getModelPreferences();
        if (cachedPreferences.length > 0) {
          setModels(cachedPreferences);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  return {
    models,
    loading,
    error
  };
}