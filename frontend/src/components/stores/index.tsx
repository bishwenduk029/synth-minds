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
      author: 'Bashu',
      date: '05/10/2020',
      src: 'https://avatars2.githubusercontent.com/u/60043166?s=400&u=cf7ed1fadbd908fb2fc4f4946b2771003283b322&v=4',
      content:
        'In the heart of the city, a quaint bookstore thrived, nestled between towering skyscrapers. Its weathered sign was an enigmatic beacon, a sanctuary to the bibliophiles of the metropolis. Each shelf was a world unto itself, filled with bound adventures, woven words, and whispers of ink. There was a symphony in the rustle of pages, a melody that lulled the noise of life outside its doors. It was a timeless capsule of stories, a testament to human imagination and its persistent resilience.',
      hasMentioned: false,
      isBot: false,
    },
    {
      author: 'Bot',
      date: '05/10/2020',
      src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
      content:
        'In the heart of the city, a quaint bookstore thrived, nestled between towering skyscrapers. Its weathered sign was an enigmatic beacon, a sanctuary to the bibliophiles of the metropolis. Each shelf was a world unto itself, filled with bound adventures, woven words, and whispers of ink. There was a symphony in the rustle of pages, a melody that lulled the noise of life outside its doors. It was a timeless capsule of stories, a testament to human imagination and its persistent resilience.',
      hasMentioned: true,
      isBot: true,
    },
    {
      author: 'Bashu',
      date: '05/10/2020',
      src: 'https://avatars2.githubusercontent.com/u/60043166?s=400&u=cf7ed1fadbd908fb2fc4f4946b2771003283b322&v=4',
      content:
        'In the heart of the city, a quaint bookstore thrived, nestled between towering skyscrapers. Its weathered sign was an enigmatic beacon, a sanctuary to the bibliophiles of the metropolis. Each shelf was a world unto itself, filled with bound adventures, woven words, and whispers of ink. There was a symphony in the rustle of pages, a melody that lulled the noise of life outside its doors. It was a timeless capsule of stories, a testament to human imagination and its persistent resilience.',
      hasMentioned: false,
      isBot: false,
    },
  ],
};

export const { useStore } = createStore(initialStore);
