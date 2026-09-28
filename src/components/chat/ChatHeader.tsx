import { useNavigate } from 'react-router-dom';

export const ChatHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  return (
    <header>
      <button aria-label="Назад" onClick={() => void navigate('/chats')}>
        ←
      </button>
      <strong>{title}</strong>
    </header>
  );
};
