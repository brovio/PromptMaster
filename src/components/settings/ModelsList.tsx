import React from 'react';
import { OpenRouterModel } from '../../types/openrouter';
import { Switch } from '../ui/Switch';
import { formatPrice } from '../../utils/format';

interface ModelsListProps {
  models: OpenRouterModel[];
  enabledModels: Set<string>;
  onToggleModel: (modelId: string) => void;
}

export default function ModelsList({ models, enabledModels, onToggleModel }: ModelsListProps) {
  return (
    <div className="space-y-4">
      {models.map((model) => (
        <div
          key={model.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{model.name}</h3>
            {model.description && (
              <p className="text-sm text-gray-500">{model.description}</p>
            )}
            <div className="mt-1 text-xs text-gray-500">
              <span>Context: {model.context_length.toLocaleString()} tokens</span>
              <span className="mx-2">•</span>
              <span>
                ${formatPrice(model.pricing.prompt)}/1K prompt tokens
              </span>
              <span className="mx-2">•</span>
              <span>
                ${formatPrice(model.pricing.completion)}/1K completion tokens
              </span>
            </div>
          </div>
          <Switch
            checked={enabledModels.has(model.id)}
            onCheckedChange={() => onToggleModel(model.id)}
          />
        </div>
      ))}
    </div>
  );
}