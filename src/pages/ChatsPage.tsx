import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChats } from '@app/chat/ChatProvider';
import { normalizeChatId } from '@shared/lib/chatId';
import { ThemeToggle } from '@components/ui/ThemeToggle';
export const ChatsPage = () => {
  const { chats, createChat } = useChats();
  const navigate = useNavigate();
  const [number, setNumber] = useState('');
  const open = () => {
    const id = normalizeChatId(number);
    if (!id) return;
    createChat(id);
    void navigate(`/chats/${id}`);
  };
  return (
    <main className="chats">
      <section>
        <div className="title">
          <h1>Чаты</h1>
          <ThemeToggle />
        </div>
        <div className="new-chat">
          <input
            placeholder="Номер получателя"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <button onClick={open}>Создать чат</button>
        </div>
        {chats.map((chat) => (
          <button
            className="chat-row"
            key={chat.id}
            onClick={() => void navigate(`/chats/${chat.id}`)}
          >
            {chat.title}
          </button>
        ))}
      </section>
    </main>
  );
};
