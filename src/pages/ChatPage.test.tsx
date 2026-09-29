import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AxiosResponse } from 'axios';
import { GreenApi } from '@api/GreenApi';
import { App } from '@app/App';

jest.mock('@api/GreenApi', () => ({
  GreenApi: {
    deleteNotification: jest.fn(),
    receiveNotification: jest.fn(),
    sendMessage: jest.fn(),
  },
}));

// Static methods are replaced with Jest mocks and never called as detached production methods.
// eslint-disable-next-line @typescript-eslint/unbound-method
const mockSendMessage = jest.mocked(GreenApi.sendMessage);
// eslint-disable-next-line @typescript-eslint/unbound-method
const mockReceiveNotification = jest.mocked(GreenApi.receiveNotification);

const openChat = async () => {
  const user = userEvent.setup();
  window.history.pushState({}, '', '/connect');
  render(<App />);

  await user.type(screen.getByLabelText('Id инстанса'), 'id');
  await user.type(screen.getByLabelText('API token'), 'token');
  await user.click(screen.getByRole('button', { name: 'Продолжить' }));
  await user.type(screen.getByRole('textbox', { name: 'Номер получателя' }), '9991234567');
  await user.click(screen.getByRole('button', { name: 'Создать чат' }));

  return user;
};

describe('ChatPage', () => {
  beforeEach(() => {
    mockReceiveNotification.mockResolvedValue({ data: null } as AxiosResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('marks a message as sent after a successful API request', async () => {
    mockSendMessage.mockResolvedValue({ data: { idMessage: 'api-message-id' } } as AxiosResponse);
    const user = await openChat();

    await user.type(screen.getByRole('textbox', { name: 'Текст сообщения' }), 'Привет');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(mockSendMessage).toHaveBeenCalledWith(
      { idInstance: 'id', apiTokenInstance: 'token' },
      { chatId: '79991234567@c.us', message: 'Привет' },
    );
    expect(await screen.findByLabelText('Отправлено')).toBeInTheDocument();
  });

  it('shows an error and marks a message as failed after a rejected API request', async () => {
    mockSendMessage.mockRejectedValue(new Error('Network error'));
    const user = await openChat();

    await user.type(screen.getByRole('textbox', { name: 'Текст сообщения' }), 'Привет');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось отправить сообщение');
    expect(screen.getByLabelText('Ошибка при отправке')).toBeInTheDocument();
  });

  it('does not send the same draft twice while the first request is pending', async () => {
    let resolveRequest: (value: AxiosResponse) => void;
    mockSendMessage.mockImplementation(
      () =>
        new Promise<AxiosResponse>((resolve) => {
          resolveRequest = resolve;
        }),
    );
    const user = await openChat();

    await user.type(screen.getByRole('textbox', { name: 'Текст сообщения' }), 'Привет');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));
    await user.type(screen.getByRole('textbox', { name: 'Текст сообщения' }), 'Ещё');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(mockSendMessage).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();

    resolveRequest!({ data: { idMessage: 'api-message-id' } } as AxiosResponse);
  });
});
