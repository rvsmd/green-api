import { act, renderHook } from '@testing-library/react';
import type { AxiosResponse } from 'axios';
import { GreenApi } from '@api/GreenApi';
import { useNotificationPolling } from './useNotificationPolling';

jest.mock('@api/GreenApi', () => ({
  GreenApi: {
    receiveNotification: jest.fn(),
    deleteNotification: jest.fn(),
  },
}));

// Static methods are replaced with Jest mocks and never called as detached production methods.
// eslint-disable-next-line @typescript-eslint/unbound-method
const mockReceiveNotification = jest.mocked(GreenApi.receiveNotification);
// eslint-disable-next-line @typescript-eslint/unbound-method
const mockDeleteNotification = jest.mocked(GreenApi.deleteNotification);
const credentials = { idInstance: 'id', apiTokenInstance: 'token' };

describe('useNotificationPolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockReceiveNotification.mockResolvedValue({ data: null } as AxiosResponse);
    mockDeleteNotification.mockResolvedValue({ data: { result: true } } as AxiosResponse);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('получает уведомления каждые три секунды', async () => {
    renderHook(() =>
      useNotificationPolling({
        credentials,
        onMessage: jest.fn(),
        onError: jest.fn(),
      }),
    );

    expect(mockReceiveNotification).toHaveBeenCalledTimes(1);

    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });

    expect(mockReceiveNotification).toHaveBeenCalledTimes(2);
  });

  it('передаёт сообщение неактивного чата для сохранения до подтверждения уведомления', async () => {
    const onMessage = jest.fn();
    mockReceiveNotification.mockResolvedValueOnce({
      data: {
        receiptId: 42,
        body: {
          typeWebhook: 'incomingMessageReceived',
          idMessage: 'message-id',
          timestamp: 1,
          senderData: { chatId: '10000000', senderPhoneNumber: 79623198833 },
          messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Ответ' } },
        },
      },
    } as AxiosResponse);

    renderHook(() => useNotificationPolling({ credentials, onMessage, onError: jest.fn() }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(onMessage).toHaveBeenCalledWith('79623198833', {
      id: 'message-id',
      text: 'Ответ',
      createdAt: 1000,
    });
    expect(mockDeleteNotification).toHaveBeenCalledWith(credentials, 42);
  });

  it('подтверждает сервисное уведомление без данных отправителя', async () => {
    const onError = jest.fn();
    mockReceiveNotification.mockResolvedValueOnce({
      data: { receiptId: 43, body: { typeWebhook: 'stateInstanceChanged', timestamp: 1 } },
    } as AxiosResponse);

    renderHook(() => useNotificationPolling({ credentials, onMessage: jest.fn(), onError }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockDeleteNotification).toHaveBeenCalledWith(credentials, 43);
    expect(onError).toHaveBeenCalledWith(null);
  });
});
