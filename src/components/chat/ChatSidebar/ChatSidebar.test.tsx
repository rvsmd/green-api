import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@app/theme/ThemeProvider';

import { ChatSidebar } from './ChatSidebar';

test('enables chat creation only for a valid Russian phone number', async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter>
      <ThemeProvider>
        <ChatSidebar chats={[]} onCreate={jest.fn()} />
      </ThemeProvider>
    </MemoryRouter>,
  );

  const button = screen.getByRole('button', { name: 'Создать чат' });

  expect(button).toBeDisabled();

  await user.type(screen.getByRole('textbox', { name: 'Номер получателя' }), '9991234567');

  expect(button).toBeEnabled();
  expect(screen.getByRole('textbox', { name: 'Номер получателя' })).toHaveValue(
    '+7 (999) 123-45-67',
  );
});
