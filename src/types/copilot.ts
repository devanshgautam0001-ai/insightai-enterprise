export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sql?: string;
  python?: string;
  chart?: {
    type: 'bar' | 'line' | 'pie' | 'area';
    data: any[];
    keys: string[];
    xKey: string;
  };
  suggestions?: string[];
  isStreaming?: boolean;
  liked?: boolean;
  disliked?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  contextFiles?: string[];
}

export interface BusinessInsight {
  id: string;
  title: string;
  category: 'revenue' | 'sales' | 'customer' | 'inventory' | 'marketing' | 'risk';
  description: string;
  impactScore: number; // 1 to 10
  actionItem: string;
  timestamp: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  type: 'cleaning' | 'ml' | 'visualization' | 'strategy';
  description: string;
  benefit: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
}
