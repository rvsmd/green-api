import { render, screen } from '@testing-library/react';

import { MessageBubble } from './MessageBubble';

test('shows a failed icon instead of a status label', () => {
  render(
    <MessageBubble
      message={{
        id: '1',
        text: 'Сообщение',
        direction: 'outgoing',
        createdAt: 0,
        status: 'failed',
      }}
    />,
  );

  expect(screen.getByLabelText('Ошибка при отправке')).toHaveAttribute(
    'title',
    'Ошибка при отправке',
  );
  expect(screen.queryByText('failed')).not.toBeInTheDocument();
});

test('shows the message creation time', () => {
  render(
    <MessageBubble
      message={{
        id: '1',
        text: 'Сообщение',
        direction: 'incoming',
        createdAt: new Date(2026, 0, 1, 12).getTime(),
      }}
    />,
  );

  expect(screen.getByText('12:00')).toBeInTheDocument();
});
