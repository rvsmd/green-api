import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChatProvider } from '@app/chat/ChatProvider';
import { ThemeProvider } from '@app/theme/ThemeProvider';
import { EmptyChatState } from '@components/chat/EmptyChatState/EmptyChatState';
import { ChatsPage } from './ChatsPage/ChatsPage';

test('shows an empty chat state before a chat is selected', () => {
  render(
    <MemoryRouter initialEntries={['/chats']}>
      <ThemeProvider>
        <ChatProvider>
          <Routes>
            <Route path="/chats" element={<ChatsPage />}>
              <Route index element={<EmptyChatState />} />
            </Route>
          </Routes>
        </ChatProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );

  expect(screen.getByText('Выберите чат')).toBeInTheDocument();
});
