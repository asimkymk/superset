import { QueryFormData } from '@superset-ui/core';

export interface AIAssistantStylesProps {
  height: number;
  width: number;
}

export interface AIAssistantProps {
  height: number;
  width: number;
  formData: QueryFormData;
}

export interface Message {
  role: 'user' | 'ai';
  content: string;
}
