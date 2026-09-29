import { normalizeChatId, toApiChatId } from './chatId';

it('normalizes recipient number', () => {
  expect(normalizeChatId('+7 (999) 123-45-67')).toBe('79991234567');
});

it('formats a phone number as a GREEN-API private chat id', () => {
  expect(toApiChatId('79991234567')).toBe('79991234567@c.us');
});
