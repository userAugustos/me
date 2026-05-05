export interface TickerItem {
  text: string
  emphasis?: {
    title: string
    href?: string
  }
}

export const items: TickerItem[] = [
  {
    text: 'Watching',
    emphasis: { title: 'NBA playoffs' },
  },
  {
    text: 'Listening to',
    emphasis: {
      title: 'Kishi Bashi: NPR Music Tiny Desk Concert',
      href: 'https://www.youtube.com/watch?v=BgqAmZHkkTg&list=RDBgqAmZHkkTg&start_radio=1',
    },
  },
  {
    text: 'Wrapping up',
    emphasis: {
      title: 'ThePrimeagen Courses',
      href: 'https://frontendmasters.com/teachers/the-primeagen/',
    },
  },
  { text: 'Considering moving back to SQLite' },
  { text: 'Avoiding any team tool that is not Slack' },
]
