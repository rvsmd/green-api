import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import type { Chat } from '@app/chat/types';
import { ThemeToggle } from '@components/ui/ThemeToggle/ThemeToggle';
import { formatPhone, getPhoneDigits, isPhoneValid, removePhoneDigit } from '@shared/lib/phone';

import styles from './ChatSidebar.module.scss';

type Props = {
  chats: Chat[];
  onCreate: (number: string) => void;
};

export const ChatSidebar = ({ chats, onCreate }: Props) => {
  const [number, setNumber] = useState('');

  const create = () => {
    if (!isPhoneValid(number)) return;

    onCreate(getPhoneDigits(number).replace(/^8/, '7'));
    setNumber('');
  };

  return (
    <aside className={styles.sidebar} data-chat-sidebar>
      <div className={styles.heading}>
        <h1>Чаты</h1>
        <ThemeToggle />
      </div>
      <div className={styles.creator}>
        <label className="visually-hidden" htmlFor="recipient-phone">
          Номер получателя
        </label>
        <input
          id="recipient-phone"
          inputMode="tel"
          placeholder="+7 (999) 123-45-67"
          value={formatPhone(number)}
          onChange={(event) => setNumber(getPhoneDigits(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === 'Enter') create();

            if (
              event.key === 'Backspace' &&
              event.currentTarget.selectionStart === event.currentTarget.selectionEnd &&
              event.currentTarget.selectionStart !== null &&
              !/\d/.test(event.currentTarget.value[event.currentTarget.selectionStart - 1] ?? '')
            ) {
              event.preventDefault();
              setNumber(removePhoneDigit(number, event.currentTarget.selectionStart));
            }
          }}
        />
        <button disabled={!isPhoneValid(number)} type="button" onClick={create}>
          Создать чат
        </button>
      </div>
      <nav aria-label="Список чатов" className={styles.list}>
        {chats.map((chat) => (
          <NavLink
            className={({ isActive }) => `${styles.listItem} ${isActive ? styles.active : ''}`}
            key={chat.id}
            to={`/chats/${chat.id}`}
          >
            <span aria-hidden="true" className={styles.avatar}>
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
