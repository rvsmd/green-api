import { Navigate, Route, Routes } from 'react-router-dom';
import { useSession } from '@app/session/SessionProvider';
import { ChatPage } from '@pages/ChatPage';
import { ChatsPage } from '@pages/ChatsPage';
import { ConnectionPage } from '@pages/ConnectionPage';
const Protected = ({ children }: { children: React.ReactNode }) =>
  useSession().credentials ? children : <Navigate to="/connect" replace />;
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
    />
    <Route
      path="/chats/:chatId"
      element={
        <Protected>
          <ChatPage />
        </Protected>
      }
    />
    <Route path="*" element={<Navigate to="/connect" replace />} />
  </Routes>
);
