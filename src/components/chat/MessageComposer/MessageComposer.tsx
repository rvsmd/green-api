import { MAX_MESSAGE_LENGTH, validateMessage } from '@shared/lib/validation';

import styles from './MessageComposer.module.scss';

type MessageComposerProps = {
  value: string;
  error?: string | null;
  isSending?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const MessageComposer = ({
  value,
  error,
  isSending = false,
  onChange,
  onSubmit,
}: MessageComposerProps) => {
  const validationError = validateMessage(value);
  const canSubmit = !validationError && !isSending;

  return (
    <footer className={styles['message-composer']}>
      <div className={styles['message-composer__field']}>
        <label className="visually-hidden" htmlFor="message-text">
          Текст сообщения
        </label>
        <textarea
          aria-describedby="message-character-count"
          aria-invalid={Boolean(error)}
          id="message-text"
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Сообщение"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();

              if (canSubmit) onSubmit();
            }
          }}
        />
        <span className={styles['message-composer__character-count']} id="message-character-count">
          {value.length} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>
      <button disabled={!canSubmit} onClick={onSubmit}>
        Отправить
      </button>
      {error && (
        <p className={styles['message-composer__error']} role="alert">
          {error}
        </p>
      )}
    </footer>
  );
};
