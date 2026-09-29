import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChatProvider } from '@app/chat/ChatProvider';
import { SessionProvider } from '@app/session/SessionProvider';
import { ThemeProvider } from '@app/theme/ThemeProvider';

import { AppRouter } from './AppRouter';

jest.mock('@pages', () => ({
  ChatPage: () => <div>Chat page</div>,
  ChatsPage: () => <div>Chats page</div>,
  ConnectionPage: () => <h1>MAX Чаты</h1>,
}));

test('redirects an unauthenticated user from chats to connection', () => {
  render(
    <MemoryRouter initialEntries={['/chats']}>
      <ThemeProvider>
        <SessionProvider>
          <ChatProvider>
            <AppRouter />
          </ChatProvider>
        </SessionProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'MAX Чаты' })).toBeInTheDocument();
});
