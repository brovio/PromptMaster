import React, { useState, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import type { PromptHistory } from '../../hooks/usePromptHistory';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

interface HistoryItemProps {
  item: PromptHistory;
}

export function HistoryItem({ item }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { copy, copied } = useCopyToClipboard();

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const formattedDate = formatDistanceToNow(new Date(item.created_at), { 
    addSuffix: true 
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
        onClick={toggleExpand}
      >
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{item.tokens} tokens</span>
            <span>•</span>
            <span>${item.cost.toFixed(6)}</span>
          </div>
        </div>
        <button 
          className="p-1 text-gray-400 hover:text-gray-600"
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t p-4 space-y-4">
          <PromptSection
            title="Original Prompt"
            content={item.content}
            onCopy={copy}
            copied={copied}
          />
          <PromptSection
            title="Result"
            content={item.result}
            onCopy={copy}
            copied={copied}
          />
          <div className="text-sm text-gray-500 grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Model:</span>{' '}
              {item.model_id.split('/')[1]}
            </div>
            <div>
              <span className="font-medium">Processing Time:</span>{' '}
              {item.processing_time.toFixed(2)}s
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PromptSectionProps {
  title: string;
  content: string;
  onCopy: (text: string) => void;
  copied: boolean;
}

function PromptSection({ title, content, onCopy, copied }: PromptSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        <button
          onClick={() => onCopy(content)}
          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-wrap font-mono">
        {content}
      </pre>
    </div>
  );
}