import type { Message } from '@/types/ws-events';

export const errorMessage = (receivedMessage: Message) => {
  return JSON.stringify({
    event: 'error',
    message: 'message not sent',
    data: receivedMessage,
  });
};
