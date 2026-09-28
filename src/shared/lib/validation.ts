const MAX_MESSAGE_LENGTH = 4000;

export const validateMessage = (value: string): string | null => {
  if (!value.trim()) return 'Введите сообщение';
  if (value.length > MAX_MESSAGE_LENGTH) return 'Сообщение не должно быть длиннее 4000 символов';
  return null;
};
