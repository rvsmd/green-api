const phoneDigits = 11;

export const getPhoneDigits = (value: string): string =>
  value.replace(/\D/g, '').slice(0, phoneDigits);

export const formatPhone = (value: string): string => {
  const digits = getPhoneDigits(value).replace(/^8/, '7');
  const number = digits.slice(1);
  const parts = [number.slice(0, 3), number.slice(3, 6), number.slice(6, 8), number.slice(8, 10)];

  return `+7${parts[0] ? ` (${parts[0]}` : ''}${parts[0]?.length === 3 ? ')' : ''}${
    parts[1] ? ` ${parts[1]}` : ''
  }${parts[2] ? `-${parts[2]}` : ''}${parts[3] ? `-${parts[3]}` : ''}`;
};

export const isPhoneValid = (value: string): boolean =>
  getPhoneDigits(value).length === phoneDigits;

export const removePhoneDigit = (value: string, cursor: number): string => {
  const digits = getPhoneDigits(value);
  const formatted = formatPhone(digits);
  const digitIndex =
    [...formatted.slice(0, cursor)].filter((symbol) => /\d/.test(symbol)).length - 1;

  return digitIndex > 0 ? `${digits.slice(0, digitIndex)}${digits.slice(digitIndex + 1)}` : digits;
};
