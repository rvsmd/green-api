import { useNavigate } from 'react-router-dom';

import styles from './ChatHeader.module.scss';

export const ChatHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <button
        aria-label="Назад"
        className={styles.backButton}
        onClick={() => void navigate('/chats')}
      >
        ←
      </button>
      <strong>+{title}</strong>
    </header>
  );
};
