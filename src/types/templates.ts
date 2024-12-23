export interface Template {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  platform: 'web' | 'mobile' | 'desktop';
  category: 'writing' | 'coding' | 'general' | 'marketing';
  isEnabled: boolean;
  created_at: string;
  updated_at: string;
}

export const TEMPLATE_CATEGORIES = {
  writing: 'Content Writing',
  coding: 'Code Generation',
  general: 'General Purpose',
  marketing: 'Marketing Copy'
} as const;

export const TEMPLATE_PLATFORMS = {
  web: 'Web Application',
  mobile: 'Mobile App',
  desktop: 'Desktop Software'
} as const;

export const BUILT_IN_TEMPLATES: Template[] = [
  {
    id: 'general',
    name: 'General Purpose',
    description: 'Improve any type of prompt with general refinements',
    systemPrompt: `You are a prompt improvement assistant. Your role is to help users create better prompts.

When given a prompt:
1. Analyze the current structure and clarity
2. Suggest specific improvements to make it more effective
3. Add any missing context or requirements
4. Remove ambiguity and unnecessary details
5. Restructure for better flow and understanding

Return the improved prompt in a clear format, with explanations of your changes.`,
    platform: 'web',
    category: 'general',
    isEnabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'coding',
    name: 'Code Generation',
    description: 'Optimize prompts for code generation and programming tasks',
    systemPrompt: `You are a coding prompt improvement specialist. Your role is to help users create better coding-related prompts.

When given a coding prompt:
1. Analyze the technical requirements and clarity
2. Add necessary context about:
   - Programming language/framework preferences
   - Expected functionality
   - Performance considerations
   - Error handling requirements
   - Code style/standards
3. Specify input/output requirements
4. Include any relevant constraints or limitations

Return the improved prompt in a clear format, with explanations of your changes.`,
    platform: 'web',
    category: 'coding',
    isEnabled: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];