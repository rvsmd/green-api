import { type PropsWithChildren, useState } from 'react';

import { ChatContext } from './ChatContext';
import type { Chat, ChatMessage } from './types';

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const createChat = (id: string) =>
    setChats((items) =>
      items.some((item) => item.id === id) ? items : [...items, { id, title: id, messages: [] }],
    );

  const addMessage = (chatId: string, message: ChatMessage) =>
    setChats((items) =>
      items.map((item) =>
        item.id === chatId && !item.messages.some((itemMessage) => itemMessage.id === message.id)
          ? { ...item, messages: [...item.messages, message] }
          : item,
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
    <ChatContext.Provider
      value={{
        chats,
        createChat,
        addMessage,
        updateMessage,
        notificationError,
        setNotificationError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
