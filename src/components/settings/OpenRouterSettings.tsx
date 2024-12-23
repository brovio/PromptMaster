import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useOpenRouter } from '../../hooks/useOpenRouter';
import ApiKeyForm from './ApiKeyForm';
import ModelsList from './ModelsList';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export default function OpenRouterSettings() {
  const { models, loading, error, refreshModels, hasApiKey } = useOpenRouter();
  const [enabledModels, setEnabledModels] = useState<Set<string>>(new Set());

  if (!hasApiKey) {
    return <ApiKeyForm />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading available models..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={refreshModels}
          className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  const handleToggleModel = (modelId: string) => {
    setEnabledModels(prev => {
      const next = new Set(prev);
      if (next.has(modelId)) {
        next.delete(modelId);
      } else {
        next.add(modelId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Available Models</h3>
        <button
          onClick={refreshModels}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
          title="Refresh models"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <ModelsList
        models={models}
        enabledModels={enabledModels}
        onToggleModel={handleToggleModel}
      />
    </div>
  );
}