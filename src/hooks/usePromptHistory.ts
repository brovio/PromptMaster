import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export interface PromptHistory {
  id: string;
  title: string;
  content: string;
  result: string;
  model_id: string;
  template_id: string;
  tokens: number;
  cost: number;
  processing_time: number;
  created_at: string;
}

export function usePromptHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<PromptHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setHistory(data || []);
      } catch (err) {
        console.error('Error fetching prompt history:', err);
        setError('Failed to load prompt history. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return { history, loading, error };
}