import { validateMessage } from './validation';

it('accepts 4000 characters and rejects 4001', () => {
  expect(validateMessage('a'.repeat(4000))).toBeNull();
  expect(validateMessage('a'.repeat(4001))).toBe('Сообщение не должно быть длиннее 4000 символов');
});
