import { useState, useEffect } from 'react';
import { BUILT_IN_TEMPLATES, type Template } from '../types/templates';

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<Template[]>(BUILT_IN_TEMPLATES);

  const getTemplate = (id: string) => {
    return templates.find(t => t.id === id);
  };

  const getEnabledTemplates = () => {
    return templates.filter(t => t.isEnabled);
  };

  return {
    templates,
    getTemplate,
    getEnabledTemplates
  };
}