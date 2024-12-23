export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

export interface ModelPreference {
  id: string;
  modelId: string;
  provider: string;
  isEnabled: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}