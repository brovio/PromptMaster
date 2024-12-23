export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_superadmin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  rating: number;
  usageCount: number;
}

export type LLMProvider = 'openai' | 'anthropic' | 'google';

export interface PromptTest {
  id: string;
  promptId: string;
  provider: LLMProvider;
  result: string;
  metrics: {
    tokens: number;
    cost: number;
    latency: number;
  };
  timestamp: Date;
}