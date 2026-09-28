# GREEN-API MAX Chat

Тестовое React-приложение для отправки текстовых сообщений и получения одного текстового ответа через GREEN-API MAX.

## Запуск

```bash
yarn install
yarn dev
```

При необходимости создайте `.env` на основе `.env.example`. По умолчанию используется `https://api.green-api.com`.

## Скрипты

```bash
yarn test --runInBand
yarn lint
yarn stylelint
yarn typecheck
yarn build
```

## Возможности

- подключение по `idInstance` и `apiTokenInstance`;
- создание чата по номеру получателя;
- отправка текстовых сообщений до 4000 символов;
- получение одного текстового уведомления через HTTP API;
- светлая и тёмная темы;
- адаптивные маршруты `/connect`, `/chats`, `/chats/:chatId`.

Учётные данные и чаты хранятся только в памяти вкладки. Метод `DeleteNotification` намеренно не реализован по согласованному объёму MVP; после непустого уведомления polling останавливается.
