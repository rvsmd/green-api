# GREEN-API MAX Chat Design

## Goal

Create a Vite React application that lets a user connect with GREEN-API credentials, open a MAX chat by recipient number, send a text message, and display one received text reply.

## Scope

The application implements connection credentials, one or more locally created chats, text-only sending and receiving, the MAX-inspired desktop and mobile interfaces, and light and dark themes.

It excludes media, calls, channels, contacts, server-side history, MAX authorization, message editing, and notification deletion. Without `DeleteNotification`, receiving stops after the first non-empty notification; this is an accepted MVP limitation.

## Stack and Code Style

- React 18, React Router, TypeScript, Vite 7, Yarn, Axios, SCSS Modules, Jest, and React Testing Library.
- ESLint 9 flat config, Prettier, Stylelint, Husky, lint-staged, and strict TypeScript.
- TypeScript settings mirror the strictness used in `json-configurator`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `noUncheckedSideEffectImports`.
- Project-local tooling configuration replaces `@proit/configs`, keeping the test assignment independently installable.
- API modules follow the `digital-department/src/api` style: an Axios configuration module plus a class exposing static typed methods.

## Architecture

```text
src/
  api/
    axiosConfig.ts
    GreenApi.ts
    types.ts
  app/
    App.tsx
    chat/
      ChatProvider.tsx
    router/
      AppRouter.tsx
      routes.tsx
    theme/
      ThemeProvider.tsx
      themeMode.ts
    styles/
      globals.scss
      tokens.scss
  components/
    chat/
      ChatHeader.tsx
      ChatList.tsx
      CreateChatDialog.tsx
      MessageBubble.tsx
      MessageComposer.tsx
      MessageList.tsx
    connection/
      ConnectionForm.tsx
    ui/
      Avatar.tsx
      Button.tsx
      EmptyState.tsx
      IconButton.tsx
      Input.tsx
  hooks/
    useNotificationPolling.ts
  pages/
    ChatPage.tsx
    ChatsPage.tsx
    ConnectionPage.tsx
  shared/
    lib/
  test/
    setup.ts
```

- `api` owns only HTTP contracts and Axios calls.
- `pages` owns route composition and page-level state wiring.
- `components` contains all reusable visual components. `components/chat` groups domain components, while `components/ui` holds domain-neutral primitives.
- `hooks` owns reusable stateful behaviour such as notification polling.
- `shared/lib` contains pure format and validation helpers.
- `app` owns routing, in-memory credentials and chat state, and the theme provider.

## Routing

Use `react-router-dom` with `BrowserRouter` and these routes:

```text
/connect       ConnectionPage
/chats         ChatsPage (chat list, no selected chat)
/chats/:chatId ChatPage (selected chat)
*              Navigate to /connect
```

`/chats` and `/chats/:chatId` are protected by an in-memory credentials guard. When credentials are missing, including after page refresh, navigation returns to `/connect`. `ChatsPage` navigates to `/chats/:chatId` after chat creation or selection; the mobile back control returns to `/chats`.

## API Integration

Credentials are supplied at runtime and remain in React state only. They are never committed, stored in `localStorage`, or configured as Axios defaults.

The API URL is `import.meta.env.VITE_GREEN_API_URL` with fallback `https://api.green-api.com`. The URL is not exposed as a user-facing field.

```ts
type ApiCredentials = {
  idInstance: string;
  apiTokenInstance: string;
};

class GreenApi {
  static sendMessage(credentials: ApiCredentials, body: SendMessageRequest) {}
  static receiveNotification(credentials: ApiCredentials, signal: AbortSignal) {}
}
```

The methods call:

```text
POST {apiUrl}/waInstance{idInstance}/sendMessage/{apiTokenInstance}
GET  {apiUrl}/waInstance{idInstance}/receiveNotification/{apiTokenInstance}?receiveTimeout=5
```

`sendMessage` sends `chatId` and `message`; messages are limited to 4000 characters. Recipient input is normalized by removing `+`, spaces, brackets, and hyphens before being passed as a string `chatId`.

Only notifications with `typeWebhook: incomingMessageReceived`, `typeMessage: textMessage`, and `textMessageData.textMessage` become a chat message. A non-empty notification ends polling because notification deletion is intentionally outside MVP scope.

## User Flow

1. The connection page requests `idInstance` and `apiTokenInstance`.
2. After validation, the user sees the chat workspace and creates a chat by recipient number.
3. The user enters text and sends it with the button or Enter; Shift+Enter inserts a line break.
4. The outgoing message shows a sending, sent, or failed status.
5. The active chat starts a cancellable long-poll request. A matching incoming text reply is rendered and polling stops.
6. Reloading clears credentials and local chats.

## UI and Responsive Behaviour

Desktop (from 768 px) has a visual navigation rail, a 320–360 px chat list, and an active chat area. The active chat contains a header, an original abstract CSS pattern, message bubbles, and a composer.

Mobile starts at the chat list. An opened chat fills the screen; its back button returns to the list. Header and composer remain fixed, the composer respects `safe-area-inset-bottom`, and bubbles are at most 88% wide.

The layout is visually inspired by MAX references but uses original CSS-generated patterns and generated initial avatars rather than copied product assets.

## Themes

The app supports light and dark modes. `ThemeProvider` uses `prefers-color-scheme` initially and persists only the selected theme in `localStorage` under `green-api-theme`.

`html` receives `data-theme="light"` or `data-theme="dark"`. Every colour, border, shadow, and background-pattern value is declared only in `src/app/styles/tokens.scss` as CSS custom properties. Components use only `var(--color-...)` references.

Light mode uses white surfaces, blue chat background, and light blue outgoing bubbles. Dark mode uses graphite surfaces, a near-black blue-patterned chat background, graphite incoming bubbles, and violet outgoing bubbles.

## Error Handling and Accessibility

- Credentials and message content are validated before requests.
- Axios failures display a concise, user-visible API error.
- Empty receive responses restart polling; aborting a request or changing chats cancels it via `AbortController`.
- Inputs have labels, icon-only controls have accessible names, and all interactive controls expose a visible focus state.
- Automatic scroll happens only when the user is already at the bottom of the message list.

## Quality Gates

Jest and React Testing Library cover API request construction, error handling, number normalization, message length validation, notification parsing, polling completion, connection, chat creation, sending, and theme persistence.

Before delivery run formatting check, ESLint, Stylelint, TypeScript check, Jest, and Vite production build. Verify desktop and iPhone 16 layouts manually, including theme switch and browser-console errors.

## Delivery Materials

The README documents local startup, environment variable configuration, scripts, functionality, accepted receive limitation, and deployment URL. Delivery also includes a GitHub repository link, deployed service link when available, and a screenshot or video link when available. The email subject is `Тестовое задание на должность - Фронтенд разработчик React`; the applicant's PDF resume includes a Telegram contact.

## Sources

- https://green-api.com/v3/docs/api/sending/SendMessage/
- https://green-api.com/v3/docs/api/receiving/technology-http-api/
- https://green-api.com/v3/docs/api/receiving/technology-http-api/ReceiveNotification/
