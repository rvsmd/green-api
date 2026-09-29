import { render, screen } from '@testing-library/react';

import { MessageComposer } from './MessageComposer';

test('shows a character counter and limits input to 4000 characters', () => {
  render(<MessageComposer onChange={jest.fn()} onSubmit={jest.fn()} value="Тест" />);

  expect(screen.getByText('4 / 4000')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Сообщение')).toHaveAttribute('maxLength', '4000');
  expect(screen.getByPlaceholderText('Сообщение')).toHaveAccessibleName('Текст сообщения');
  expect(screen.getByRole('button', { name: 'Отправить' })).toBeEnabled();
});

test('disables sending a blank message and exposes an API error', () => {
  render(
    <MessageComposer
      error="Ошибка получения сообщений: HTTP 403"
      onChange={jest.fn()}
      onSubmit={jest.fn()}
      value=" "
    />,
  );

  expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  expect(screen.getByRole('alert')).toHaveTextContent('Ошибка получения сообщений: HTTP 403');
});
