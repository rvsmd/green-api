# GREEN-API MAX Chat

React-приложение для отправки и получения текстовых сообщений в MAX через GREEN-API. Выполнено в рамках тестового задания: подключение инстанса, создание чатов по номеру и обмен текстовыми сообщениями.

## Возможности

- подключение по `idInstance` и `apiTokenInstance`;
- создание чата по российскому номеру телефона с маской и валидацией;
- отправка текста до 4000 символов и защита от повторной отправки;
- получение уведомлений раз в 3 секунды через HTTP API;
- подтверждение обработанного уведомления методом `deleteNotification`;
- хранение чатов и сообщений только в памяти вкладки;
- адаптивный интерфейс, светлая/тёмная тема и автоматическая a11y-проверка.

## Требования

- Node.js 24+ и Corepack для локального запуска;
- либо Docker Desktop / Docker Engine для контейнерного запуска;
- авторизованный инстанс MAX в GREEN-API.

## Локальный запуск

```bash
corepack enable
yarn install --immutable
Copy-Item .env.example .env
yarn dev
```

После запуска откройте `http://localhost:5173`. В `.env` можно изменить адрес API:

```dotenv
VITE_GREEN_API_URL=https://3100.api.green-api.com
```

`idInstance` и `apiTokenInstance` вводятся на странице подключения и не записываются в localStorage или в репозиторий.

## Docker

```bash
docker compose up --build
```

Откройте `http://localhost:5173`. Для другого устройства в той же сети используйте `http://<IP-адрес-компьютера>:5173`.

## Проверки

```bash
yarn lint
yarn stylelint
yarn typecheck
yarn test --runInBand
yarn build
```

Одна команда для полного набора проверок:

```bash
yarn prepush:check
```

## Используемые методы GREEN-API

- [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/) — отправка текстового сообщения;
- [HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/) — получение уведомлений из очереди;
- [ReceiveNotification](https://green-api.com/v3/docs/api/receiving/technology-http-api/receiveNotification/) и [DeleteNotification](https://green-api.com/v3/docs/api/receiving/technology-http-api/deleteNotification/) — чтение и подтверждение уведомлений;
- [Формат входящего текстового уведомления](https://green-api.com/v3/docs/api/receiving/notifications-format/incoming/IncomingMessageReceived/) — структура получаемых данных.

API возвращает сообщение в очередь отправки; успешный ответ `sendMessage` не равен доставке адресату. Подробности описаны в [документации SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/).
