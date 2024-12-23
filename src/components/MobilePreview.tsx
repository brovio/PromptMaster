import React from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

interface PreviewSection {
  title: string;
  content: string;
}

interface MobilePreviewProps {
  content?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

function PreviewSectionComponent({ title, content }: PreviewSection) {
  const [copied, setCopied] = React.useState(false);

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
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2">
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
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">{content}</pre>
      </div>
    </div>
  );
}

function parseContent(content: string): PreviewSection[] {
  const sections: PreviewSection[] = [];
  let currentTitle = '';
  let currentContent = '';
  
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for section titles
    if (line.endsWith(':') && !line.includes(' ')) {
      // Save previous section if exists
      if (currentTitle && currentContent.trim()) {
        sections.push({
          title: currentTitle,
          content: currentContent.trim()
        });
      }
      currentTitle = line.slice(0, -1); // Remove colon
      currentContent = '';
    } else {
      currentContent += line + '\n';
    }
  }
  
  // Add final section
  if (currentTitle && currentContent.trim()) {
    sections.push({
      title: currentTitle,
      content: currentContent.trim()
    });
  }
  
  return sections;
}

export default function MobilePreview({ content, loading, onRefresh }: MobilePreviewProps) {
  const sections = content ? parseContent(content) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Preview</h2>
        <button
          onClick={onRefresh}
          className={`p-2 text-gray-500 hover:text-gray-700 rounded-lg ${
            loading ? 'animate-spin' : ''
          }`}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 bg-gray-50 min-h-[200px] lg:min-h-[calc(100vh-16rem)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Processing...</div>
          </div>
        ) : sections.length > 0 ? (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <PreviewSectionComponent
                key={index}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">
            Preview will appear here
          </div>
        )}
      </div>
    </div>
  );
}