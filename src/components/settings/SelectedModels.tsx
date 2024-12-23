import React from 'react';
import { X } from 'lucide-react';

interface SelectedModelsProps {
  models: Array<{
    provider: string;
    modelId: string;
    name: string;
  }>;
  onRemove: (index: number) => void;
}

export default function SelectedModels({ models, onRemove }: SelectedModelsProps) {
  if (models.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        <p>No models selected.</p>
        <p className="text-sm mt-2">Add models above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 flex items-center gap-2">
        Selected Models
        <span className="text-sm text-gray-500">({models.length})</span>
      </h3>
      <div className="space-y-2">
        {models.map((model, index) => (
          <div
            key={`${model.provider}-${model.modelId}-${index}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">{model.name}</p>
              <p className="text-sm text-gray-500 truncate">{model.provider}</p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Remove model"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}