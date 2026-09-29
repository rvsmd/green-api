import { api } from '@api/axiosConfig';

import type {
  ApiCredentials,
  DeleteNotificationResponse,
  ReceiveNotificationResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@api/types';

const configuredApiUrl = import.meta.env.VITE_GREEN_API_URL as string | undefined;
const apiUrl = configuredApiUrl ?? 'https://api.green-api.com';

const instancePath = ({ idInstance, apiTokenInstance }: ApiCredentials, method: string) =>
  `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}`;

export class GreenApi {
  static sendMessage(credentials: ApiCredentials, body: SendMessageRequest) {
    return api.post<SendMessageResponse>(instancePath(credentials, 'sendMessage'), body);
  }

  static receiveNotification(credentials: ApiCredentials, signal: AbortSignal) {
    return api.get<ReceiveNotificationResponse | null>(
      instancePath(credentials, 'receiveNotification'),
      { params: { receiveTimeout: 5 }, signal },
    );
  }

  static deleteNotification(credentials: ApiCredentials, receiptId: number) {
    return api.delete<DeleteNotificationResponse>(
      `${instancePath(credentials, 'deleteNotification')}/${receiptId}`,
    );
  }
}
