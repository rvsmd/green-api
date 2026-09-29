import type { ChatMessage } from '@app/chat/types';

import styles from './MessageBubble.module.scss';

const statusLabels = {
  failed: 'Ошибка при отправке',
  sending: 'Ожидание отправки',
  sent: 'Отправлено',
};

const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

const MessageDeliveryStatus = ({ status }: { status: NonNullable<ChatMessage['status']> }) => (
  <span
    aria-label={statusLabels[status]}
    className={`${styles['message-bubble__status']} ${styles[`message-bubble__status--${status}`]}`}
    role="img"
    title={statusLabels[status]}
  >
    {status === 'sent' && '✓'}
    {status === 'failed' && '×'}
  </span>
);

export const MessageBubble = ({ message }: { message: ChatMessage }) => (
  <div className={`${styles['message-bubble']} ${styles[`message-bubble--${message.direction}`]}`}>
    {message.direction === 'outgoing' && message.status && (
      <MessageDeliveryStatus status={message.status} />
    )}
    <div
      className={`${styles['message-bubble__content']} ${styles[`message-bubble__content--${message.direction}`]}`}
    >
      <span>{message.text}</span>
      <time
        className={styles['message-bubble__time']}
        dateTime={new Date(message.createdAt).toISOString()}
      >
        {timeFormatter.format(message.createdAt)}
      </time>
    </div>
  </div>
);
