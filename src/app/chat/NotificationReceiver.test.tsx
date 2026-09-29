import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AxiosResponse } from 'axios';

import { GreenApi } from '@api/GreenApi';
import { SessionProvider } from '@app/session/SessionProvider';
import { useSession } from '@app/session/useSession';

import { ChatProvider } from './ChatProvider';
import { NotificationReceiver } from './NotificationReceiver';
import { useChats } from './useChats';

jest.mock('@api/GreenApi', () => ({
  GreenApi: {
    deleteNotification: jest.fn().mockResolvedValue({ data: { result: true } }),
    receiveNotification: jest.fn(),
  },
}));

// Static method is replaced by a Jest mock and never called as a detached production method.
// eslint-disable-next-line @typescript-eslint/unbound-method
const mockReceiveNotification = jest.mocked(GreenApi.receiveNotification);

const Probe = () => {
  const { connect } = useSession();
  const { chats } = useChats();

  return (
    <>
      <button onClick={() => connect({ idInstance: 'id', apiTokenInstance: 'token' })}>
        Подключить
      </button>
      <output>{chats.map((chat) => chat.title).join(',')}</output>
    </>
  );
};

test('stores an incoming message from an inactive chat before acknowledgement', async () => {
  mockReceiveNotification.mockResolvedValue({ data: null } as AxiosResponse);
  mockReceiveNotification.mockResolvedValueOnce({
    data: {
      receiptId: 42,
      body: {
        typeWebhook: 'incomingMessageReceived',
        idMessage: 'message-id',
        timestamp: 1,
        senderData: { senderPhoneNumber: 79623198833 },
        messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Ответ' } },
      },
    },
  } as AxiosResponse);

  const user = userEvent.setup();

  render(
    <SessionProvider>
      <ChatProvider>
        <NotificationReceiver />
        <Probe />
      </ChatProvider>
    </SessionProvider>,
  );

  await user.click(screen.getByRole('button', { name: 'Подключить' }));

  expect(await screen.findByRole('status')).toHaveTextContent('79623198833');
});
