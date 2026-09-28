import { normalizeChatId } from './chatId';

it('normalizes recipient number', () => {
  expect(normalizeChatId('+7 (999) 123-45-67')).toBe('79991234567');
});
