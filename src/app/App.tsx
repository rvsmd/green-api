import { BrowserRouter } from 'react-router-dom';

import { ChatProvider } from '@app/chat/ChatProvider';
import { NotificationReceiver } from '@app/chat/NotificationReceiver';
import { AppRouter } from '@app/router/AppRouter';
import { SessionProvider } from '@app/session/SessionProvider';
import { ThemeProvider } from '@app/theme/ThemeProvider';

export const App = () => (
  <ThemeProvider>
    <SessionProvider>
      <ChatProvider>
        <NotificationReceiver />
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ChatProvider>
    </SessionProvider>
  </ThemeProvider>
);
