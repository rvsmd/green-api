# GREEN-API MAX Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable React chat client for GREEN-API MAX that sends text and displays one received reply in a responsive, themeable MAX-inspired interface.

**Architecture:** React Router separates connection, chat-list, and active-chat pages. Reusable UI lives in `src/components`; `src/api` encapsulates Axios calls, and `useNotificationPolling` owns the cancellable receive lifecycle. CSS variables in one token file provide both themes.

**Tech Stack:** React 18, React Router, TypeScript, Vite 7, Axios, SCSS Modules, Jest, React Testing Library, ESLint, Prettier, Stylelint, Husky, lint-staged.

**Spec:** `docs/superpowers/specs/2026-09-28-green-api-max-chat-design.md`

## Global Constraints

- Use Yarn and a project-local toolchain; do not depend on `@proit/configs`.
- Keep strict TypeScript with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `noUncheckedSideEffectImports`.
- Use Axios only through `src/api`; do not use `fetch` in components or hooks.
- Store credentials and chats in memory only. Persist only `green-api-theme`.
- Build API URLs from runtime credentials and `VITE_GREEN_API_URL`, falling back to `https://api.green-api.com`.
- Implement `sendMessage` and `receiveNotification`; do not implement `DeleteNotification`.
- Stop polling after the first non-empty notification.
- Declare every colour, border, shadow, and background pattern value only in `src/app/styles/tokens.scss`; component styles use CSS variables.
- Use original CSS patterns and generated initial avatars; do not copy MAX assets.
- Provide `/connect`, `/chats`, and `/chats/:chatId`; protect chat routes when credentials are absent.

## Review Focus

- Refreshing `/chats/:chatId` must redirect to `/connect`, because credentials are deliberately in-memory — covered in Task 4.
- A non-empty notification for another chat must not render as the current chat's reply — covered in Task 6.
- A message with exactly 4000 characters must send, while 4001 characters must not — covered in Task 2 and Task 6.
- Aborting a receive request during route change must not expose an error alert — covered in Task 6.
- Switching themes must not change credentials, chats, or the active route — covered in Task 3 and Task 7.

## File Structure

| Path | Responsibility |
|---|---|
| `src/api/axiosConfig.ts` | Configured Axios instance without runtime credentials. |
| `src/api/GreenApi.ts` | Typed static GREEN-API send/receive methods. |
| `src/api/types.ts` | API request and notification contracts. |
| `src/app/chat/ChatProvider.tsx` | In-memory chat summaries and message state shared across routes. |
| `src/app/router/*` | Route definitions and credentials guard. |
| `src/app/theme/*` | Theme state, persistence, and document attribute. |
| `src/app/styles/tokens.scss` | All theme tokens. |
| `src/pages/*` | Route-level page composition. |
| `src/components/chat/*` | Reusable chat-specific UI. |
| `src/components/connection/*` | Credential form. |
| `src/components/ui/*` | Reusable domain-neutral primitives. |
| `src/hooks/useNotificationPolling.ts` | Cancellable receive lifecycle. |
| `src/shared/lib/*` | Pure validation, formatting, and chat ID helpers. |

### Task 1: Bootstrap the Vite project and quality gates

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`
- Create: `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.stylelintrc.json`, `.stylelintignore`, `.gitignore`
- Create: `.husky/pre-commit`, `.husky/pre-push`, `jest.config.ts`, `src/test/setup.ts`

**Interfaces:**
- Produces: `yarn dev`, `yarn build`, `yarn typecheck`, `yarn lint`, `yarn stylelint`, `yarn format:check`, and `yarn test` scripts.

- [ ] **Step 1: Initialize Git and scaffold the Vite React TypeScript project without overwriting the approved documentation**

Run: `git init` and create the Vite entry files in the existing workspace.

- [ ] **Step 2: Add a failing Jest smoke test**

Create `src/app/App.test.tsx` that imports `App` and asserts it renders a heading.

- [ ] **Step 3: Run the smoke test to verify it fails**

Run: `yarn test App.test.tsx --runInBand`

Expected: FAIL because `App` and Jest configuration do not exist.

- [ ] **Step 4: Configure dependencies and scripts**

Install React 18, React Router, Axios, Sass, Jest with jsdom and SWC transform, React Testing Library, ESLint 9, TypeScript 5.8, Prettier, Stylelint, Husky, and lint-staged. Configure aliases for `@api`, `@app`, `@components`, `@hooks`, `@pages`, and `@shared` in Vite, TypeScript, and Jest.

- [ ] **Step 5: Implement the minimal `App` heading and test setup**

Create `src/app/App.tsx` with an accessible temporary heading solely until Task 4 replaces it with the routed application.

- [ ] **Step 6: Verify the scaffold**

Run: `yarn test --runInBand`, `yarn typecheck`, `yarn lint`, `yarn stylelint`, and `yarn build`

Expected: all commands pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "chore: bootstrap max chat project"
```

### Task 2: Add pure domain helpers and the Axios API layer

**Files:**
- Create: `src/api/axiosConfig.ts`, `src/api/GreenApi.ts`, `src/api/types.ts`
- Create: `src/shared/lib/chatId.ts`, `src/shared/lib/validation.ts`, `src/shared/lib/formatters.ts`
- Test: `src/api/GreenApi.test.ts`, `src/shared/lib/chatId.test.ts`, `src/shared/lib/validation.test.ts`

**Interfaces:**
- Produces: `normalizeChatId(value: string): string`, `validateMessage(value: string): string | null`, and `GreenApi.sendMessage(credentials, body)` / `GreenApi.receiveNotification(credentials, signal)`.

- [ ] **Step 1: Write failing helper and API tests**

Assert `normalizeChatId('+7 (999) 123-45-67') === '79991234567'`; assert 4000 characters are valid and 4001 return an error. Mock Axios and assert `sendMessage` posts `{ chatId, message }` to the specified runtime URL; assert `receiveNotification` includes `receiveTimeout=5` and receives the `AbortSignal`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test GreenApi chatId validation --runInBand`

Expected: FAIL because helpers and `GreenApi` do not exist.

- [ ] **Step 3: Implement the contracts and functions**

Define `ApiCredentials`, `SendMessageRequest`, `SendMessageResponse`, and receive-notification types in `src/api/types.ts`. Export `api` from `axiosConfig.ts`. Implement static methods with `axios.request`, reading `VITE_GREEN_API_URL ?? 'https://api.green-api.com'`.

- [ ] **Step 4: Verify helpers and API layer**

Run: `yarn test GreenApi chatId validation --runInBand`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/api src/shared/lib
git commit -m "feat: add green api client"
```

### Task 3: Implement theme tokens and reusable UI primitives

**Files:**
- Create: `src/app/styles/tokens.scss`, `src/app/styles/globals.scss`
- Create: `src/app/theme/themeMode.ts`, `src/app/theme/ThemeProvider.tsx`
- Create: `src/components/ui/Avatar.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/IconButton.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/EmptyState.tsx`
- Test: `src/app/theme/ThemeProvider.test.tsx`

**Interfaces:**
- Produces: `ThemeProvider`, `useTheme(): { mode: ThemeMode; toggleTheme(): void }`, and reusable, accessible UI primitives.

- [ ] **Step 1: Write the failing theme test**

Mock `matchMedia` to dark, render `ThemeProvider`, assert `html[data-theme='dark']`, toggle it, then assert `light` and `localStorage.getItem('green-api-theme') === 'light'`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test ThemeProvider --runInBand`

Expected: FAIL because the provider does not exist.

- [ ] **Step 3: Implement token and theme modules**

Define both light and dark token sets, including surfaces, text, message bubbles, borders, shadows, accent, and background-pattern properties, only in `tokens.scss`. Implement `ThemeProvider` with the stated persistence policy and `data-theme` document attribute.

- [ ] **Step 4: Implement UI primitives**

Use semantic native controls; require `aria-label` on `IconButton`; generate `Avatar` initials from the supplied name.

- [ ] **Step 5: Verify theme behaviour**

Run: `yarn test ThemeProvider --runInBand && yarn stylelint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app src/components/ui
git commit -m "feat: add themes and ui primitives"
```

### Task 4: Add session state and protected routing

**Files:**
- Create: `src/app/session/SessionProvider.tsx`, `src/app/chat/ChatProvider.tsx`, `src/app/chat/types.ts`, `src/app/router/AppRouter.tsx`, `src/app/router/routes.tsx`
- Create: `src/pages/ConnectionPage.tsx`, `src/pages/ChatsPage.tsx`, `src/pages/ChatPage.tsx`
- Modify: `src/app/App.tsx`, `src/main.tsx`
- Test: `src/app/router/AppRouter.test.tsx`

**Interfaces:**
- Consumes: `ApiCredentials` from Task 2 and `ThemeProvider` from Task 3.
- Produces: `ChatSummary { id: string; title: string; lastMessage?: string; updatedAt: number }`, `ChatMessage { id: string; text: string; direction: 'incoming' | 'outgoing'; createdAt: number; status?: 'sending' | 'sent' | 'failed' }`, `useSession(): { credentials: ApiCredentials | null; connect(credentials): void; disconnect(): void }`, and `useChats(): { chats: ChatSummary[]; createChat(chat: ChatSummary): void; appendMessage(chatId: string, message: ChatMessage): void }`.

- [ ] **Step 1: Write failing routing tests**

Assert `/chats` redirects to `/connect` without credentials. Connect through test session state, navigate to `/chats/demo`, and assert `ChatPage` renders. Unmount and recreate the provider to prove credentials are not persisted.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test AppRouter --runInBand`

Expected: FAIL because routes and the session provider do not exist.

- [ ] **Step 3: Implement session, chat state, and routes**

Define `ChatSummary` and `ChatMessage` in `src/app/chat/types.ts`. Use `BrowserRouter` at runtime and `MemoryRouter` in tests. Implement `ChatProvider` with in-memory collections. Define `/connect`, `/chats`, `/chats/:chatId`, and a wildcard redirect. Protect both chat routes with a guard using `useSession`.

- [ ] **Step 4: Replace the bootstrap `App` with providers and router**

Compose `ThemeProvider`, `SessionProvider`, `ChatProvider`, and `AppRouter`; keep pages minimal until Tasks 5–7.

- [ ] **Step 5: Verify protected navigation**

Run: `yarn test AppRouter --runInBand && yarn typecheck`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app src/pages src/main.tsx
git commit -m "feat: add protected chat routes"
```

### Task 5: Build connection, chat-list, and responsive layout components

**Files:**
- Create: `src/components/connection/ConnectionForm.tsx`
- Create: `src/components/chat/ChatList.tsx`, `src/components/chat/CreateChatDialog.tsx`, `src/components/chat/ChatHeader.tsx`
- Create: `src/components/layout/NavigationRail.tsx`, `src/components/layout/ChatShell.tsx`
- Modify: `src/pages/ConnectionPage.tsx`, `src/pages/ChatsPage.tsx`, `src/pages/ChatPage.tsx`
- Test: `src/components/connection/ConnectionForm.test.tsx`, `src/components/chat/CreateChatDialog.test.tsx`

**Interfaces:**
- Consumes: `useSession` and `useChats` from Task 4, `normalizeChatId` from Task 2, and UI primitives from Task 3.
- Produces: navigation to `/chats/:chatId` after `useChats().createChat`.

- [ ] **Step 1: Write failing component tests**

Assert empty credentials prevent connection. Assert a formatted recipient number creates a chat with ID `79991234567` and invokes navigation to `/chats/79991234567`.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test ConnectionForm CreateChatDialog --runInBand`

Expected: FAIL because components do not exist.

- [ ] **Step 3: Implement connection and chat-list components**

Render labeled credentials fields, a submit button, search input, create-chat dialog, and chat summaries. Keep chats in `ChatProvider` only; do not use `localStorage`.

- [ ] **Step 4: Implement the MAX-inspired responsive shell**

At 768 px and above, render navigation rail, 320–360 px list panel, and content area. Below 768 px, show the list for `/chats` and full-screen active chat for `/chats/:chatId`; `ChatHeader` back control navigates to `/chats`.

- [ ] **Step 5: Verify component behaviour**

Run: `yarn test ConnectionForm CreateChatDialog --runInBand && yarn lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components src/pages
git commit -m "feat: add connection and chat navigation"
```

### Task 6: Implement messages, send flow, and one-reply polling

**Files:**
- Create: `src/components/chat/MessageBubble.tsx`, `src/components/chat/MessageList.tsx`, `src/components/chat/MessageComposer.tsx`
- Create: `src/hooks/useNotificationPolling.ts`
- Modify: `src/pages/ChatPage.tsx`, `src/components/chat/ChatHeader.tsx`
- Test: `src/components/chat/MessageComposer.test.tsx`, `src/hooks/useNotificationPolling.test.tsx`, `src/pages/ChatPage.test.tsx`

**Interfaces:**
- Consumes: `GreenApi`, `validateMessage`, `ApiCredentials`, active `chatId`, and `AbortSignal` support from Tasks 2 and 4.
- Produces: `useNotificationPolling({ credentials, chatId, onMessage, onError }): void`.

- [ ] **Step 1: Write failing message and polling tests**

Assert `Enter` sends while `Shift+Enter` does not; assert 4001 characters disable sending. Mock `GreenApi.sendMessage` to resolve `idMessage` and verify optimistic message status becomes `sent`. Mock a matching `incomingMessageReceived` notification and assert one incoming message is emitted; mock a different `senderData.chatId` and assert no message is emitted; assert abort errors are ignored.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test MessageComposer useNotificationPolling ChatPage --runInBand`

Expected: FAIL because message components and hook do not exist.

- [ ] **Step 3: Implement reusable message components**

`MessageBubble` renders direction, time, and optional status. `MessageList` owns bottom-aware scrolling. `MessageComposer` exposes `value`, `onChange`, and `onSubmit` and renders a character count.

- [ ] **Step 4: Implement `useNotificationPolling`**

Call `GreenApi.receiveNotification(credentials, signal)` once for the active chat. Parse only text `incomingMessageReceived` payloads. Emit only when `senderData.chatId === chatId`; stop after every non-empty notification; abort on unmount or changed dependencies; never call `DeleteNotification`.

- [ ] **Step 5: Wire `ChatPage` send and receive state**

Append an optimistic outgoing message, replace its status after `sendMessage`, render API failures accessibly, and start polling only for the active route.

- [ ] **Step 6: Verify the chat flow**

Run: `yarn test MessageComposer useNotificationPolling ChatPage --runInBand`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/chat src/hooks src/pages/ChatPage.tsx
git commit -m "feat: add message sending and receiving"
```

### Task 7: Complete visual polish, documentation, and release checks

**Files:**
- Modify: `src/app/styles/globals.scss`, all relevant `*.module.scss` files
- Create: `README.md`, `.env.example`
- Modify: `package.json`

**Interfaces:**
- Consumes: all prior pages and components.
- Produces: a documented local startup path and a production-ready build.

- [ ] **Step 1: Write failing high-level UI tests**

Add tests that assert theme toggling preserves the active chat route and that the active chat page contains header, message list, and composer landmarks.

- [ ] **Step 2: Run the tests to verify they fail**

Run: `yarn test App ChatPage --runInBand`

Expected: FAIL until the final shell includes the required controls and landmarks.

- [ ] **Step 3: Apply final responsive and theme styling**

Create original abstract background patterns from tokenized CSS gradients. Check 768 px layout transition, mobile full-screen chat, focus styles, contrast, and `safe-area-inset-bottom`. Keep all colour, border, shadow, and background-pattern literals in `tokens.scss`.

- [ ] **Step 4: Write the README and environment example**

Document prerequisites, `yarn install`, `yarn dev`, test/lint/build scripts, `VITE_GREEN_API_URL`, application features, the deliberate one-notification limitation, deployment instructions, and test-submission links.

- [ ] **Step 5: Run all automated checks**

Run: `yarn format:check && yarn lint && yarn stylelint && yarn typecheck && yarn test --runInBand && yarn build`

Expected: every command exits with code 0.

- [ ] **Step 6: Perform browser verification**

Run the app and inspect desktop plus iPhone 16 viewports in light and dark modes. Verify keyboard send, mobile back navigation, connection validation, send error, one incoming reply, and absence of console errors.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "docs: finalize max chat assignment"
```

## Plan Self-Review

- Spec coverage: all scope, API, routing, reusable components, themes, tests, responsiveness, delivery, and deliberate receive limitation map to Tasks 1–7.
- Type consistency: `ApiCredentials`, `ChatSummary`, `ChatMessage`, `useSession`, and `useNotificationPolling` are introduced before consumption.
- Review focus: all five listed risks are exercised in Tasks 2–7.
- No code bodies are prescribed beyond contracts and fixed values; each task has a standalone test cycle.
