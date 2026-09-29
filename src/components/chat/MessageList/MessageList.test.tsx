import { render, screen } from '@testing-library/react';

import { MessageList } from './MessageList';

test('scrolls to the latest message when opened', () => {
  const scrollTo = jest.fn();

  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { configurable: true, value: scrollTo });
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, value: 400 });

  render(
    <MessageList
      messages={[{ id: '1', text: 'Последнее', direction: 'outgoing', createdAt: 0 }]}
    />,
  );

  expect(scrollTo).toHaveBeenCalledWith({ top: 400 });
});

test('shows messages by their creation time, not incoming array order', () => {
  render(
    <MessageList
      messages={[
        { id: 'later', text: 'Позже', direction: 'incoming', createdAt: 2_000 },
        { id: 'earlier', text: 'Раньше', direction: 'incoming', createdAt: 1_000 },
      ]}
    />,
  );

  const messages = screen.getAllByText(/Раньше|Позже/);

  expect(messages.map((message) => message.textContent)).toEqual(['Раньше', 'Позже']);
});
