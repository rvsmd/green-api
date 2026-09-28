import { createContext, type PropsWithChildren, useContext, useState } from 'react';
import type { Chat, ChatMessage } from './types';
type Value = {
  chats: Chat[];
  createChat: (id: string) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  updateMessage: (chatId: string, id: string, status: ChatMessage['status']) => void;
};
const Context = createContext<Value | null>(null);
export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const createChat = (id: string) =>
    setChats((items) =>
      items.some((item) => item.id === id) ? items : [...items, { id, title: id, messages: [] }],
    );
  const addMessage = (chatId: string, message: ChatMessage) =>
    setChats((items) =>
      items.map((item) =>
        item.id === chatId ? { ...item, messages: [...item.messages, message] } : item,
      ),
    );
  const updateMessage = (chatId: string, id: string, status: ChatMessage['status']) =>
    setChats((items) =>
      items.map((item) =>
        item.id === chatId
          ? {
              ...item,
              messages: item.messages.map((message) =>
                message.id === id ? { ...message, status } : message,
              ),
            }
          : item,
      ),
    );
  return (
    <Context.Provider value={{ chats, createChat, addMessage, updateMessage }}>
      {children}
    </Context.Provider>
  );
};
export const useChats = () => {
  const value = useContext(Context);
  if (!value) throw new Error('ChatProvider is required');
  return value;
};
