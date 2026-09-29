export const normalizeChatId = (value: string): string => value.replace(/[^\d]/g, '');

export const toApiChatId = (value: string): string => `${normalizeChatId(value)}@c.us`;
