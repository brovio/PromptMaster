import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Prompt } from '../types';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching prompts:', error);
        return;
      }

      setPrompts(data);
      setLoading(false);
    };

    fetchPrompts();
  }, [user]);

  const createPrompt = async (prompt: Partial<Prompt>) => {
    const { data, error } = await supabase
      .from('prompts')
      .insert([{ ...prompt, user_id: user?.id }])
      .select()
      .single();

    if (error) throw error;
    setPrompts([data, ...prompts]);
    return data;
  };

  const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
    const { data, error } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setPrompts(prompts.map(p => p.id === id ? data : p));
    return data;
  };

  return {
    prompts,
    loading,
    createPrompt,
    updatePrompt
  };
}