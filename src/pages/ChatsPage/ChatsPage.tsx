import { Outlet, useNavigate } from 'react-router-dom';

import { useChats } from '@app/chat/useChats';
import { ChatSidebar } from '@components/chat/ChatSidebar/ChatSidebar';
import { normalizeChatId } from '@shared/lib/chatId';

import styles from './ChatsPage.module.scss';

export const ChatsPage = () => {
  const { chats, createChat } = useChats();
  const navigate = useNavigate();

  const open = (number: string) => {
    const id = normalizeChatId(number);

    if (!id) return;

    createChat(id);
    void navigate(`/chats/${id}`);
  };

  return (
    <main className={styles['chats-page']}>
      <ChatSidebar chats={chats} onCreate={open} />
      <Outlet />
    </main>
  );
};
