import React from 'react';
import { Select } from '../ui/Select';
import type { ModelPreference } from '../../types/openrouter';
import { useModelPreferences } from '../../hooks/useModelPreferences';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelect: (modelId: string) => void;
}

export default function ModelSelector({ selectedModelId, onSelect }: ModelSelectorProps) {
  const { models, loading, error } = useModelPreferences();

  if (loading) {
    return <LoadingSpinner message="Loading models..." />;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 p-2 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
        No models configured. Please add models in settings.
      </div>
    );
  }

  const options = models
    .filter(model => model.isEnabled)
    .map(model => ({
      value: model.modelId,
      label: model.modelId.split('/')[1] // Show only model name, not provider
    }));

  return (
    <Select
      label="Select Model"
      value={selectedModelId}
      onChange={onSelect}
      options={options}
      placeholder="Choose a model"
    />
  );
}