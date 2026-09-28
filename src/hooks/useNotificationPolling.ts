import { useEffect } from 'react';
import { isAxiosError } from 'axios';
import { GreenApi } from '@api/GreenApi';
import type { ApiCredentials } from '@api/types';

type Options = {
  credentials: ApiCredentials | null;
  chatId: string;
  onMessage: (message: { id: string; text: string; createdAt: number }) => void;
  onError: (message: string) => void;
};
export const useNotificationPolling = ({ credentials, chatId, onMessage, onError }: Options) =>
  useEffect(() => {
    if (!credentials || !chatId) return;
    const controller = new AbortController();
    void GreenApi.receiveNotification(credentials, controller.signal)
      .then(({ data }) => {
        if (!data) return;
        const message = data.body.messageData;
        if (
          data.body.typeWebhook === 'incomingMessageReceived' &&
          data.body.senderData.chatId === chatId &&
          message?.typeMessage === 'textMessage' &&
          message.textMessageData?.textMessage
        )
          onMessage({
            id: data.body.idMessage,
            text: message.textMessageData.textMessage,
            createdAt: data.body.timestamp * 1000,
          });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !isAxiosError(error))
          onError('Не удалось получить сообщение');
      });
    return () => controller.abort();
  }, [chatId, credentials, onError, onMessage]);
