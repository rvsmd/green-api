import { BrowserRouter } from 'react-router-dom';
import { ChatProvider } from '@app/chat/ChatProvider';
import { AppRouter } from '@app/router/AppRouter';
import { SessionProvider } from '@app/session/SessionProvider';
import { ThemeProvider } from '@app/theme/ThemeProvider';
export const App = () => (
  <ThemeProvider>
    <SessionProvider>
      <ChatProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ChatProvider>
    </SessionProvider>
  </ThemeProvider>
);
