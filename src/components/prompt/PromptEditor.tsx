import React from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApiKeys } from '../../hooks/useApiKeys';
import { usePromptTemplates } from '../../hooks/usePromptTemplates';
import { usePromptState } from './usePromptState';
import ModelSelector from './ModelSelector';
import TemplateSelector from './TemplateSelector';
import { Button } from '../ui/Button';
import { CharacterCounter } from './CharacterCounter';

interface PromptEditorProps {
  onTest?: (content: string) => void;
}

export function PromptEditor({ onTest }: PromptEditorProps) {
  const { user } = useAuth();
  const { apiKeys } = useApiKeys();
  const { getTemplate } = usePromptTemplates();
  
  const apiKey = apiKeys.find(k => k.provider === 'openrouter')?.key_value;
  const template = getTemplate('general');

  const {
    state,
    setContent,
    setSelectedModelId,
    setSelectedTemplateId,
    handleRun
  } = usePromptState({
    user,
    apiKey,
    systemPrompt: template?.systemPrompt,
    onTest
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <ModelSelector
          selectedModelId={state.selectedModelId}
          onSelect={setSelectedModelId}
        />
        <TemplateSelector
          selectedTemplateId={state.selectedTemplateId}
          onSelect={setSelectedTemplateId}
        />
      </div>

      <div className="space-y-2">
        <textarea
          value={state.content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-48 p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-gray-50"
          placeholder="Enter your prompt here..."
        />
        <CharacterCounter text={state.content} />
      </div>

      {state.error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4" />
          {state.error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          onClick={handleRun}
          disabled={!state.selectedModelId || !state.selectedTemplateId || !state.content.trim() || state.processing}
          className="flex items-center gap-2"
        >
          <Play className={`w-4 h-4 ${state.processing ? 'animate-spin' : ''}`} />
          {state.processing ? 'Processing...' : 'Run'}
        </Button>

        {state.metrics && (
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{state.metrics.tokens} tokens</span>
            <span>${state.metrics.cost.toFixed(6)}</span>
            <span>{state.metrics.time.toFixed(2)}s</span>
          </div>
        )}
      </div>
    </div>
  );
}