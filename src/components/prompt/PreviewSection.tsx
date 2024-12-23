import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

interface PreviewSectionProps {
  title: string;
  content: string;
  type?: 'weakness' | 'improvement' | 'default';
}

export function PreviewSection({ title, content, type = 'default' }: PreviewSectionProps) {
  const [copied, setCopied] = useState(false);

  const getBgColor = () => {
    switch (type) {
      case 'weakness':
        return 'bg-yellow-50';
      case 'improvement':
        return 'bg-green-50';
      default:
        return 'bg-white';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Tooltip content={copied ? 'Copied!' : 'Copy to clipboard'}>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </Tooltip>
      </div>
      <div className={`rounded-lg p-4 border ${getBgColor()}`}>
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}