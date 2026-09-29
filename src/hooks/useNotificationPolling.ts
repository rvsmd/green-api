import { useEffect } from 'react';

import { isAxiosError } from 'axios';

import { GreenApi } from '@api/GreenApi';
import type { ApiCredentials } from '@api/types';

type Options = {
  credentials: ApiCredentials | null;
  onMessage: (chatId: string, message: { id: string; text: string; createdAt: number }) => void;
  onError: (message: string | null) => void;
};

export const useNotificationPolling = ({ credentials, onMessage, onError }: Options) =>
  useEffect(() => {
    if (!credentials) return;

    let isRequestPending = false;
    let isStopped = false;
    let controller: AbortController | null = null;

    const receive = () => {
      if (isRequestPending || isStopped) return;

      isRequestPending = true;
      const requestController = new AbortController();
      controller = requestController;
      void GreenApi.receiveNotification(credentials, requestController.signal)
        .then(async ({ data }) => {
          if (!data) {
            onError(null);
            return;
          }

          const { body } = data;
          const message = body.messageData;
          const senderPhoneNumber = body.senderData?.senderPhoneNumber;

          if (
            body.typeWebhook === 'incomingMessageReceived' &&
            senderPhoneNumber &&
            body.idMessage &&
            message?.typeMessage === 'textMessage' &&
            message.textMessageData?.textMessage
          ) {
            onMessage(String(senderPhoneNumber), {
              id: body.idMessage,
              text: message.textMessageData.textMessage,
              createdAt: body.timestamp * 1000,
            });
          }

          const deletion = await GreenApi.deleteNotification(credentials, data.receiptId);

          if (!deletion.data.result)
            throw new Error(deletion.data.reason || 'Не удалось подтвердить уведомление');
          onError(null);
        })
        .catch((error: unknown) => {
          if (requestController.signal.aborted) return;
          const status = isAxiosError(error) ? error.response?.status : undefined;
          const message = status
            ? `Ошибка получения сообщений: HTTP ${status}`
            : error instanceof Error
              ? error.message
              : 'Ошибка сети';

          onError(message);
          if (status === 401 || status === 403) {
            isStopped = true;
            window.clearInterval(intervalId);
          }
        })
        .finally(() => {
          isRequestPending = false;
        });
    };

    receive();

    const intervalId = window.setInterval(receive, 3000);

    return () => {
      window.clearInterval(intervalId);
      controller?.abort();
    };
  }, [credentials, onError, onMessage]);
