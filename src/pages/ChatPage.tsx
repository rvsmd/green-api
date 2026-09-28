import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GreenApi } from '@api/GreenApi';
import { useChats } from '@app/chat/ChatProvider';
import { useSession } from '@app/session/SessionProvider';
import { validateMessage } from '@shared/lib/validation';
import { useNotificationPolling } from '@hooks/useNotificationPolling';
import { ChatHeader } from '@components/chat/ChatHeader';
import { MessageComposer } from '@components/chat/MessageComposer';
import { MessageList } from '@components/chat/MessageList';
export const ChatPage = () => {
  const { chatId = '' } = useParams();
  const { chats, addMessage, updateMessage } = useChats();
  const { credentials } = useSession();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const chat = chats.find((item) => item.id === chatId);
  const incoming = useCallback(
    (message: { id: string; text: string; createdAt: number }) =>
      addMessage(chatId, { ...message, direction: 'incoming' }),
    [addMessage, chatId],
  );
  const failedReceive = useCallback((message: string) => setError(message), []);
  useNotificationPolling({ credentials, chatId, onMessage: incoming, onError: failedReceive });
  const send = async () => {
    const validation = validateMessage(text);
    if (validation || !credentials) {
      setError(validation ?? 'Нет подключения');
      return;
    }
    const id = crypto.randomUUID();
    addMessage(chatId, {
      id,
      text,
      direction: 'outgoing',
      createdAt: Date.now(),
      status: 'sending',
    });
    setText('');
    try {
      await GreenApi.sendMessage(credentials, { chatId, message: text });
      updateMessage(chatId, id, 'sent');
    } catch {
      updateMessage(chatId, id, 'failed');
      setError('Не удалось отправить сообщение');
    }
  };
  return (
    <main className="chat">
      <ChatHeader title={chatId} />
      {error && <p role="alert">{error}</p>}
      <MessageList messages={chat?.messages ?? []} />
      <MessageComposer value={text} onChange={setText} onSubmit={() => void send()} />
    </main>
  );
};
