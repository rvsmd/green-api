import { removePhoneDigit } from './phone';

test('removes the preceding phone digit when backspace is pressed after a mask symbol', () => {
  expect(removePhoneDigit('79991234567', 8)).toBe('7991234567');
});
