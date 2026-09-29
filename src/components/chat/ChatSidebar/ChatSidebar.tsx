import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import type { Chat } from '@app/chat/types';
import { ThemeToggle } from '@components/ui/ThemeToggle/ThemeToggle';
import { formatPhone, getPhoneDigits, isPhoneValid, removePhoneDigit } from '@shared/lib/phone';

import styles from './ChatSidebar.module.scss';

type ChatSidebarProps = {
  chats: Chat[];
  onCreate: (number: string) => void;
};

export const ChatSidebar = ({ chats, onCreate }: ChatSidebarProps) => {
  const [phoneDigits, setPhoneDigits] = useState('');

  const handleCreateChat = () => {
    if (!isPhoneValid(phoneDigits)) return;

    onCreate(getPhoneDigits(phoneDigits).replace(/^8/, '7'));
    setPhoneDigits('');
  };

  return (
    <aside className={styles['chat-sidebar']} data-chat-sidebar>
      <div className={styles['chat-sidebar__heading']}>
        <h1>Чаты</h1>
        <ThemeToggle />
      </div>
      <div className={styles['chat-sidebar__creator']}>
        <label className="visually-hidden" htmlFor="recipient-phone">
          Номер получателя
        </label>
        <input
          id="recipient-phone"
          inputMode="tel"
          placeholder="+7 (999) 123-45-67"
          value={formatPhone(phoneDigits)}
          onChange={(event) => setPhoneDigits(getPhoneDigits(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleCreateChat();

            if (
              event.key === 'Backspace' &&
              event.currentTarget.selectionStart === event.currentTarget.selectionEnd &&
              event.currentTarget.selectionStart !== null &&
              !/\d/.test(event.currentTarget.value[event.currentTarget.selectionStart - 1] ?? '')
            ) {
              event.preventDefault();
              setPhoneDigits(removePhoneDigit(phoneDigits, event.currentTarget.selectionStart));
            }
          }}
        />
        <button disabled={!isPhoneValid(phoneDigits)} type="button" onClick={handleCreateChat}>
          Создать чат
        </button>
      </div>
      <nav aria-label="Список чатов" className={styles['chat-sidebar__list']}>
        {chats.map((chat) => (
          <NavLink
            className={({ isActive }) =>
              `${styles['chat-sidebar__list-item']} ${isActive ? styles['chat-sidebar__list-item--active'] : ''}`
            }
            key={chat.id}
            to={`/chats/${chat.id}`}
          >
            <span aria-hidden="true" className={styles['chat-sidebar__avatar']}>
              {chat.title.slice(-2)}
            </span>
            <span>
              <strong>+{chat.title}</strong>
              <small>{chat.messages.at(-1)?.text ?? 'Новый чат'}</small>
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
