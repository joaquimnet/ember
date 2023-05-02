import axios from 'axios';
import { OpenAIRoles } from '../../awareness/conversation';
import { OPENAI_KEY } from '../../../config';

export type OpenAIMessages = { role: OpenAIRoles; content: string }[];

const CHAT_CONTEXT = [
  {
    role: 'system',
    content:
      "You are a lively, upbeat and optimistic assistant named Ember. Your main goal is to improve the user's day and help them with their tasks.",
  },
  {
    role: 'system',
    content: "You've known the user for a long time. You talk daily.",
  },
];

export class OpenAIClient {
  constructor(private key: string) {}

  async chatCompletion(messages: OpenAIMessages, isConversational = false) {
    const temperature = 1.3;
    const howManyChoicesToGenerate = 1;
    const maxTokens = 400;
    const stop = '\n\n';
    const frequencyPenalty = 0.5;

    const systemContext = [...CHAT_CONTEXT];

    if (isConversational) {
      systemContext.push({
        role: 'system',
        content: 'You are having a conversation with the user. Keep the answers short and simple.',
      });
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...systemContext, ...messages],
          temperature,
          n: howManyChoicesToGenerate,
          max_tokens: maxTokens,
          // stop,
          frequency_penalty: frequencyPenalty,
          user: 'Kaf',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.key}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      console.log('err.response.data: ', err.response.data);
      throw err.response.data;
    }
  }

  async instructionOrFeedback(prompt: string) {
    const temperature = 1.3;
    const howManyChoicesToGenerate = 1;
    const maxTokens = 400;
    const stop = '\n\n';
    const frequencyPenalty = 0.5;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [...CHAT_CONTEXT, { role: OpenAIRoles.SYSTEM, content: prompt }],
          temperature,
          n: howManyChoicesToGenerate,
          max_tokens: maxTokens,
          // stop,
          frequency_penalty: frequencyPenalty,
          user: 'Kaf',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.key}`,
          },
        },
      );
      console.log('response.data: ', response.data);
      return response.data.choices[0].message.content;
    } catch (err: any) {
      console.log('err.response.data: ', err.response.data);
      throw err.response.data;
    }
  }

  async systemCompletion(messages: OpenAIMessages) {
    const temperature = 0.8;
    const howManyChoicesToGenerate = 1;
    const maxTokens = 400;
    const stop = '\n\n';
    const frequencyPenalty = 0;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: messages[0].content,
          temperature,
          n: howManyChoicesToGenerate,
          max_tokens: maxTokens,
          // stop,
          frequency_penalty: frequencyPenalty,
          user: 'Kaf',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.key}`,
          },
        },
      );
      return response.data;
    } catch (err: any) {
      throw err.response.data;
    }
  }
}

export const openAIClient = new OpenAIClient(OPENAI_KEY);
