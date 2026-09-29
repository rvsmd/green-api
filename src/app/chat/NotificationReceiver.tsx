import { useCallback } from 'react';

import { useSession } from '@app/session/useSession';
import { useNotificationPolling } from '@hooks/useNotificationPolling';

import { useChats } from './useChats';

export const NotificationReceiver = () => {
  const { credentials } = useSession();
  const { addMessage, createChat, setNotificationError } = useChats();

  const handleMessage = useCallback(
    (chatId: string, message: { id: string; text: string; createdAt: number }) => {
      createChat(chatId);
      addMessage(chatId, { ...message, direction: 'incoming' });
    },
    [addMessage, createChat],
  );

  useNotificationPolling({
    credentials,
    onMessage: handleMessage,
    onError: setNotificationError,
  });

  return null;
};
