import { conversation } from '../../../config';
import { ConversationContext } from './context';

export function contextLengthCull(context: ConversationContext) {
  const totalCharacterLength = context.messages.reduce((acc, m) => acc + m.content.length, 0);

  if (totalCharacterLength > conversation.MAX_TOTAL_CHARACTER_LENGTH) {
    const messagesInContextReversed = [...context.messages].reverse();
    const newContext = [];

    let currentTotalCharacterLength = 0;

    for (const message of messagesInContextReversed) {
      if (currentTotalCharacterLength < conversation.MAX_TOTAL_CHARACTER_LENGTH) {
        newContext.push(message);
        currentTotalCharacterLength += message.content.length;
      }
    }

    context.messages = newContext.reverse();
  }
}

export function contextAgeCull(context: ConversationContext) {
  const now = new Date();
  const maxAgeDate = new Date(now.getTime() - conversation.MAX_AGE * 60000);

  context.messages = context.messages.filter((m) => m.timestamp > maxAgeDate);
}