import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Select } from '../ui/Select';
import { useOpenRouter } from '../../hooks/useOpenRouter';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ModelSelectorProps {
  onModelSelect: (model: { provider: string; modelId: string; name: string }) => void;
}

export default function ModelSelector({ onModelSelect }: ModelSelectorProps) {
  const { models, loading, error, selectedProvider, selectedModel, setSelectedProvider, setSelectedModel } = useOpenRouter();
  const [isAdding, setIsAdding] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Loading models..." />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Get unique providers from models
  const providers = Array.from(new Set(models.map(m => {
    const [provider] = m.id.split('/');
    return provider;
  }))).map(provider => ({
    value: provider,
    label: provider.charAt(0).toUpperCase() + provider.slice(1)
  }));

  // Get models for selected provider
  const providerModels = models.filter(m => m.id.startsWith(selectedProvider + '/'))
    .map(m => ({
      value: m.id,
      label: m.name
    }));

  const handleAdd = () => {
    if (selectedProvider && selectedModel) {
      const model = models.find(m => m.id === selectedModel);
      if (model) {
        setIsAdding(true);
        onModelSelect({
          provider: selectedProvider,
          modelId: model.id,
          name: model.name
        });
        setSelectedProvider('');
        setSelectedModel('');
        setIsAdding(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Select
        label="Provider"
        value={selectedProvider}
        onChange={(value) => {
          setSelectedProvider(value);
          setSelectedModel('');
        }}
        options={providers}
        placeholder="Select provider"
        icon={<Search className="w-4 h-4" />}
        className="w-full"
      />

      <Select
        label="Model"
        value={selectedModel}
        onChange={setSelectedModel}
        options={providerModels}
        placeholder="Select model"
        disabled={!selectedProvider}
        className="w-full"
      />

      <Button
        onClick={handleAdd}
        disabled={!selectedProvider || !selectedModel || isAdding}
        className="w-full"
      >
        {isAdding ? 'Adding...' : 'Add Model'}
      </Button>
    </div>
  );
}