import React from 'react';
import { HistoryItem } from './HistoryItem';
import type { PromptHistory } from '../../hooks/usePromptHistory';

interface HistoryListProps {
  items: PromptHistory[];
}

export function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No prompts in history yet</p>
        <p className="text-gray-500 text-sm mt-1">
          Your prompt history will appear here after you run some prompts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}