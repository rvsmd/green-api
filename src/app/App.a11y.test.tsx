import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { App } from '@app/App';

jest.mock('@api/GreenApi', () => ({
  GreenApi: {
    deleteNotification: jest.fn(),
    receiveNotification: jest.fn().mockResolvedValue({ data: null }),
    sendMessage: jest.fn(),
  },
}));

expect.extend(toHaveNoViolations);

test('connection screen has no automated accessibility violations', async () => {
  window.history.pushState({}, '', '/connect');

  const { container } = render(<App />);
  const result = await axe(container);

  expect(result).toHaveNoViolations();
});
