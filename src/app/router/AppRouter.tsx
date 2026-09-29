import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import { useChats } from '@app/chat/useChats';
import { EmptyChatState } from '@components/chat/EmptyChatState/EmptyChatState';
import { useSession } from '@app/session/useSession';
import { ChatPage, ChatsPage, ConnectionPage } from '@pages';

const Protected = ({ children }: { children: React.ReactNode }) =>
  useSession().credentials ? children : <Navigate to="/connect" replace />;

const ChatRoute = () => {
  const { chatId } = useParams();
  const { chats } = useChats();

  if (!chatId || !chats.some((chat) => chat.id === chatId)) return <Navigate replace to="/chats" />;

  return <ChatPage key={chatId} />;
};

export const AppRouter = () => (
  <Routes>
    <Route path="/connect" element={<ConnectionPage />} />
    <Route
      path="/chats"
      element={
        <Protected>
          <ChatsPage />
        </Protected>
      }
    >
      <Route index element={<EmptyChatState />} />
      <Route path=":chatId" element={<ChatRoute />} />
    </Route>
    <Route path="*" element={<Navigate to="/connect" replace />} />
  </Routes>
);
