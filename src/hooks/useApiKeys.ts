import { useState, useEffect } from 'react';
import { supabase, enhancedQuery } from '../lib/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { ProfileService } from '../lib/profile.service';
import { AppError } from '../lib/error';

interface ApiKey {
  id: string;
  provider: string;
  key_value: string;
  is_active: boolean;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchApiKeys = async () => {
      try {
        setError(null);
        await ProfileService.ensureProfileExists(user.id);
        
        const { data, error: fetchError } = await enhancedQuery
          .from('api_keys')
          .select('*');

        if (fetchError) throw fetchError;
        setApiKeys(data || []);
      } catch (err) {
        console.error('Error fetching API keys:', err);
        setError('Failed to load API keys. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApiKeys();
  }, [user]);

  const saveApiKey = async (provider: string, keyValue: string) => {
    if (!user) throw new Error('No user authenticated');

    try {
      await ProfileService.ensureProfileExists(user.id);

      const { data, error } = await enhancedQuery
        .from('api_keys')
        .insert({
          user_id: user.id,
          provider,
          key_value: keyValue,
          is_active: true
        });

      if (error) throw error;
      if (!data) throw new AppError('Failed to save API key');

      setApiKeys(prev => [...prev, data[0]]);
      return data[0];
    } catch (err) {
      console.error('Error saving API key:', err);
      throw new AppError('Failed to save API key. Please try again.');
    }
  };

  return {
    apiKeys,
    loading,
    error,
    saveApiKey
  };
}