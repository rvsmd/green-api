import { MAX_MESSAGE_LENGTH, validateMessage } from '@shared/lib/validation';

import styles from './MessageComposer.module.scss';

type Props = {
  value: string;
  error?: string | null;
  isSending?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export const MessageComposer = ({ value, error, isSending = false, onChange, onSubmit }: Props) => {
  const validationError = validateMessage(value);
  const canSubmit = !validationError && !isSending;

  return (
    <footer className={styles.composer}>
      <div className={styles.field}>
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
        <span className={styles.characterCount} id="message-character-count">
          {value.length} / {MAX_MESSAGE_LENGTH}
        </span>
      </div>
      <button disabled={!canSubmit} onClick={onSubmit}>
        Отправить
      </button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </footer>
  );
};
