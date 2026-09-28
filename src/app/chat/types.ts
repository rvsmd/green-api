export type ChatMessage = {
  id: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  createdAt: number;
  status?: 'sending' | 'sent' | 'failed';
};
export type Chat = { id: string; title: string; messages: ChatMessage[] };
