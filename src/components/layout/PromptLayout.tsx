import React, { useState, useCallback } from 'react';
import { Container } from './Container';
import { PromptEditor } from '../prompt/PromptEditor';
import { PromptPreview } from '../prompt/PromptPreview';

interface PromptLayoutProps {
  onTest?: (content: string) => void;
}

export function PromptLayout({ onTest }: PromptLayoutProps) {
  const [previewContent, setPreviewContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = useCallback(async (content: string) => {
    setLoading(true);
    try {
      setPreviewContent(content);
      onTest?.(content);
    } finally {
      setLoading(false);
    }
  }, [onTest]);

  const handleRefresh = useCallback(() => {
    if (previewContent) {
      handleTest(previewContent);
    }
  }, [previewContent, handleTest]);

  return (
    <Container className="py-4">
      <div className="grid lg:grid-cols-2 gap-4 max-w-[1920px] mx-auto">
        <div className="lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <PromptEditor onTest={handleTest} />
        </div>
        <div className="lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <PromptPreview 
            content={previewContent}
            loading={loading}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </Container>
  );
}