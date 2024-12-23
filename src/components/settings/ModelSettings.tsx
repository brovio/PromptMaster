import React, { useState, useEffect } from 'react';
import { useOpenRouter } from '../../hooks/useOpenRouter';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import ApiKeyForm from './ApiKeyForm';
import ModelSelector from './ModelSelector';
import SelectedModels from './SelectedModels';
import { Button } from '../ui/Button';
import { HelpCircle } from 'lucide-react';
import { useModelPreferences } from '../../hooks/useModelPreferences';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Tooltip } from '../ui/Tooltip';

export default function ModelSettings() {
  const { loading: apiLoading, hasApiKey } = useOpenRouter();
  const { models: savedModels, loading: preferencesLoading } = useModelPreferences();
  const [selectedModels, setSelectedModels] = useState<Array<{
    provider: string;
    modelId: string;
    name: string;
  }>>([]);
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (savedModels.length > 0) {
      setSelectedModels(savedModels.map(model => ({
        provider: model.provider,
        modelId: model.modelId,
        name: model.modelId.split('/')[1]
      })));
    }
  }, [savedModels]);

  if (apiLoading || preferencesLoading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  const handleModelSelect = (model: { provider: string; modelId: string; name: string }) => {
    setSelectedModels(prev => [...prev, model]);
  };

  const handleRemoveModel = (index: number) => {
    setSelectedModels(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      await supabase
        .from('model_preferences')
        .delete()
        .eq('user_id', user.id);
      
      const { error } = await supabase.from('model_preferences').insert(
        selectedModels.map((model, index) => ({
          user_id: user.id,
          model_id: model.modelId,
          provider: model.provider,
          is_enabled: true,
          priority: index,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      );

      if (error) throw error;
    } catch (err) {
      console.error('Error saving model preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!hasApiKey ? (
        <ApiKeyForm />
      ) : (
        <>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Model Settings</h2>
            <Tooltip content="Configure which AI models you want to use in your prompts">
              <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <ModelSelector onModelSelect={handleModelSelect} />
            </div>

            <Button 
              onClick={handleSave} 
              disabled={selectedModels.length === 0 || saving}
              className="w-full"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>

            <SelectedModels
              models={selectedModels}
              onRemove={handleRemoveModel}
            />
          </div>
        </>
      )}
    </div>
  );
}