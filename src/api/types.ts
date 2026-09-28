export type ApiCredentials = { idInstance: string; apiTokenInstance: string };
export type SendMessageRequest = { chatId: string; message: string };
export type SendMessageResponse = { idMessage: string };
export type ReceiveNotificationResponse = {
  receiptId: number;
  body: {
    typeWebhook: string;
    idMessage: string;
    timestamp: number;
    senderData: { chatId: string };
    messageData?: { typeMessage: string; textMessageData?: { textMessage: string } };
  };
};
