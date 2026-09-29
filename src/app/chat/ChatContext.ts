import { createContext } from 'react';
import type { Chat, ChatMessage } from './types';

export type ChatContextValue = {
  chats: Chat[];
  createChat: (id: string) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  updateMessage: (chatId: string, id: string, status: ChatMessage['status']) => void;
  notificationError: string | null;
  setNotificationError: (error: string | null) => void;
};

export const ChatContext = createContext<ChatContextValue | null>(null);
