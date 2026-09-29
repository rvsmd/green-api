import { useEffect, useRef } from 'react';

import type { ChatMessage } from '@app/chat/types';
import { MessageBubble } from '@components/chat/MessageBubble/MessageBubble';

import styles from './MessageList.module.scss';

export const MessageList = ({ messages }: { messages: ChatMessage[] }) => {
  const listRef = useRef<HTMLElement>(null);
  const messagesByCreationTime = [...messages].sort(
    (left, right) => left.createdAt - right.createdAt,
  );

  useEffect(() => {
    const list = listRef.current;

    if (list) list.scrollTo({ top: list.scrollHeight });
  }, [messages.length]);

  return (
    <section className={styles.list} ref={listRef}>
      {messagesByCreationTime.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </section>
  );
};
