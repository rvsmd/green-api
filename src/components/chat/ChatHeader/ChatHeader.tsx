import { useNavigate } from 'react-router-dom';

import styles from './ChatHeader.module.scss';

export const ChatHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <header className={styles['chat-header']}>
      <button
        aria-label="Назад"
        className={styles['chat-header__back-button']}
        onClick={() => void navigate('/chats')}
      >
        ←
      </button>
      <strong>+{title}</strong>
    </header>
  );
};
