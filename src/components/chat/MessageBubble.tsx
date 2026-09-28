import type { ChatMessage } from '@app/chat/types';

export const MessageBubble = ({ message }: { message: ChatMessage }) => (
  <div className={`message ${message.direction}`}>
    {message.text}
    <small>{message.status}</small>
  </div>
);
