import React from 'react';

interface CharacterCounterProps {
  text: string;
  className?: string;
}

export function CharacterCounter({ text, className = '' }: CharacterCounterProps) {
  const chars = text.length;
  const tokens = Math.round(chars / 4); // Rough estimate

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      <span>{chars} characters</span>
      <span className="mx-1">•</span>
      <span>~{tokens} tokens</span>
    </div>
  );
}