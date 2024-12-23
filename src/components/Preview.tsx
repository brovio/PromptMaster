import React from 'react';
import { RefreshCw, Download, Copy } from 'lucide-react';

interface PreviewProps {
  content?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function Preview({ content, loading, onRefresh }: PreviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className={`p-2 text-gray-500 hover:text-gray-700 rounded-lg ${
              loading ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg">
            <Copy className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="w-full h-[calc(100vh-250px)] p-4 bg-gray-50 rounded-lg overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-gray-400">Processing...</div>
            </div>
          ) : content ? (
            <pre className="whitespace-pre-wrap">{content}</pre>
          ) : (
            <div className="text-gray-400 text-center">
              Preview will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}