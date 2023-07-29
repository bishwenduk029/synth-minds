import createStore from 'teaful';

export interface Message {
  author: string;
  date: string;
  src: string;
  content: string;
  hasMentioned: boolean;
  isBot: boolean;
}

interface Store {
  messages: Message[];
}

const initialStore: Store = {
  messages: [
    {
      author: 'Bot',
      date: '05/10/2020',
      src: 'https://wqttbosbkuefkspmaqfa.supabase.co/storage/v1/object/public/ava/synth.png?t=2023-07-29T19%3A48%3A17.368Z',
      content:
        'I will be your guide for creating interactive knowledge bots. How would you like begin!!',
      hasMentioned: true,
      isBot: true,
    },
  ],
};

export const { useStore } = createStore(initialStore);
