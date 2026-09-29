import type { ChatMessage } from '@app/chat/types';

import styles from './MessageBubble.module.scss';

const statusLabels = {
  failed: 'Ошибка при отправке',
  sending: 'Ожидание отправки',
  sent: 'Отправлено',
};

const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

const MessageStatus = ({ status }: { status: NonNullable<ChatMessage['status']> }) => (
  <span
    aria-label={statusLabels[status]}
    className={`${styles.status} ${styles[status]}`}
    role="img"
    title={statusLabels[status]}
  >
    {status === 'sent' && '✓'}
    {status === 'failed' && '×'}
  </span>
);

export const MessageBubble = ({ message }: { message: ChatMessage }) => (
  <div className={`${styles.row} ${styles[message.direction]}`}>
    {message.direction === 'outgoing' && message.status && (
      <MessageStatus status={message.status} />
    )}
    <div className={`${styles.message} ${styles[message.direction]}`}>
      <span>{message.text}</span>
      <time className={styles.time} dateTime={new Date(message.createdAt).toISOString()}>
        {timeFormatter.format(message.createdAt)}
      </time>
    </div>
  </div>
);
