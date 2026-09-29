import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatProvider } from './ChatProvider';
import { useChats } from './useChats';

const Probe = () => {
  const { chats, addMessage, createChat } = useChats();
  const message = { id: 'message-id', text: 'Тест', direction: 'incoming' as const, createdAt: 0 };
  return (
    <>
      <button onClick={() => createChat('chat')}>Создать</button>
      <button onClick={() => addMessage('chat', message)}>Добавить</button>
      <output>{chats[0]?.messages.length ?? 0}</output>
    </>
  );
};

test('does not add a notification with an existing id twice', async () => {
  const user = userEvent.setup();
  render(
    <ChatProvider>
      <Probe />
    </ChatProvider>,
  );

  await user.click(screen.getByRole('button', { name: 'Создать' }));
  await user.click(screen.getByRole('button', { name: 'Добавить' }));
  await user.click(screen.getByRole('button', { name: 'Добавить' }));

  expect(screen.getByRole('status')).toHaveTextContent('1');
});
