import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { GreenApi } from '@api/GreenApi';
import { useChats } from '@app/chat/useChats';
import { useSession } from '@app/session/useSession';
import { ChatHeader } from '@components/chat/ChatHeader/ChatHeader';
import { MessageComposer } from '@components/chat/MessageComposer/MessageComposer';
import { MessageList } from '@components/chat/MessageList/MessageList';
import { toApiChatId } from '@shared/lib/chatId';
import { validateMessage } from '@shared/lib/validation';

import styles from './ChatPage.module.scss';

export const ChatPage = () => {
  const { chatId = '' } = useParams();
  const { chats, addMessage, notificationError, updateMessage } = useChats();
  const { credentials } = useSession();
  const [text, setText] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const chat = chats.find((item) => item.id === chatId);

  const send = async () => {
    const validation = validateMessage(text);

    if (validation || !credentials || isSending) return;

    const id = crypto.randomUUID();
    addMessage(chatId, {
      id,
      text,
      direction: 'outgoing',
      createdAt: Date.now(),
      status: 'sending',
    });
    setIsSending(true);
    setText('');

    try {
      await GreenApi.sendMessage(credentials, { chatId: toApiChatId(chatId), message: text });
      updateMessage(chatId, id, 'sent');
      setSendError(null);
    } catch {
      updateMessage(chatId, id, 'failed');
      setSendError('Не удалось отправить сообщение');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className={styles['chat-page']} data-chat>
      <ChatHeader title={chatId} />
      <MessageList messages={chat?.messages ?? []} />
      <MessageComposer
        error={sendError ?? notificationError}
        isSending={isSending}
        value={text}
        onChange={setText}
        onSubmit={() => void send()}
      />
    </section>
  );
};
