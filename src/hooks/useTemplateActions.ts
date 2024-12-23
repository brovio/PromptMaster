import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface TemplateUpdates {
  systemPrompt?: string;
  name?: string;
  description?: string;
}

export function useTemplateActions() {
  const [saving, setSaving] = useState(false);

  const updateTemplate = async (id: string, updates: TemplateUpdates) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating template:', err);
      throw new Error('Failed to update template');
    } finally {
      setSaving(false);
    }
  };

  return {
    updateTemplate,
    saving
  };
}