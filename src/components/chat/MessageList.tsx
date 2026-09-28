import type { ChatMessage } from '@app/chat/types';
import { MessageBubble } from './MessageBubble';

export const MessageList = ({ messages }: { messages: ChatMessage[] }) => (
  <section className="messages">
    {messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ))}
  </section>
);
