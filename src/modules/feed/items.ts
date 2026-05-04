export type FeedKind = 'essay' | 'repo' | 'post' | 'talk' | 'note'

export type Lang = 'ts' | 'go' | 'rs' | 'py'

export interface FeedDate {
  day: string
  mo: string
  year: string
}

interface BaseItem {
  date: FeedDate
  meta: string
  title: string
  lede: string
  tags: string[]
}

export type RepoItem = BaseItem & {
  kind: 'repo'
  lang: Lang
  langName: string
  stars: string
  forks: string
  code: string[]
}

export type StandardItem = BaseItem & {
  kind: Exclude<FeedKind, 'repo'>
}

export type FeedItem = RepoItem | StandardItem

export const items: FeedItem[] = [
  {
    kind: 'essay',
    date: { day: '30', mo: 'Apr', year: '26' },
    meta: '12 min read',
    title: "On state machines, and why your bug isn't where you think it is",
    lede: "Most production bugs I've debugged in the last decade aren't logic errors — they're transitions that were never named. A short defense of making the implicit explicit.",
    tags: ['state-machines', 'rust', 'essay'],
  },
  {
    kind: 'repo',
    date: { day: '27', mo: 'Apr', year: '26' },
    meta: 'v0.4.1 · pushed 2h ago',
    title: 'orbit/runtime — a deterministic actor runtime',
    lede: "Single-binary actor model with replayable event logs and time-travel debugging. Inspired by Erlang/OTP, written for the kind of systems where 'eventually consistent' is a euphemism.",
    tags: ['rust', 'distributed-systems', 'actor-model'],
    lang: 'rs',
    langName: 'Rust',
    stars: '2.4k',
    forks: '118',
    code: [
      '<span class="ln">42</span><span class="kw">impl</span> Actor <span class="kw">for</span> <span class="fn">OrderSaga</span> {',
      '<span class="ln">43</span>  <span class="kw">fn</span> <span class="fn">handle</span>(&<span class="kw">mut</span> self, msg: Msg) -> Transition {',
      '<span class="ln">44</span>    <span class="cm">// fail loudly, fail early, fail in writing</span>',
      '<span class="ln">45</span>    self.transition_or_panic(msg)',
      '<span class="ln">46</span>  }',
    ],
  },
  {
    kind: 'post',
    date: { day: '24', mo: 'Apr', year: '26' },
    meta: 'Short · 3 min',
    title: 'Postgres LISTEN/NOTIFY is still the right answer for 80% of you',
    lede: "We replaced our event bus with two lines of SQL and a goroutine. Latency went down. The on-call burden went down. The 'distributed systems' tax we'd been paying for years was, it turns out, optional.",
    tags: ['postgres', 'go', 'infra'],
  },
  {
    kind: 'essay',
    date: { day: '19', mo: 'Apr', year: '26' },
    meta: '8 min read',
    title: 'API ergonomics is a moral question',
    lede: 'Every awkward parameter, every silently swallowed error, every endpoint that returns 200 with an error in the body — these are choices, made by someone, paid for by someone else. A taxonomy.',
    tags: ['api-design', 'ethics', 'essay'],
  },
  {
    kind: 'talk',
    date: { day: '11', mo: 'Apr', year: '26' },
    meta: 'QCon Brasil · 38 min · video',
    title: 'Idempotency is a property, not a header',
    lede: 'Talk on building APIs that survive retries, network partitions, and the inevitable client that wraps your endpoint in a while-true. Slides + video + the ugly state diagram I drew live.',
    tags: ['talk', 'apis', 'qcon'],
  },
  {
    kind: 'repo',
    date: { day: '06', mo: 'Apr', year: '26' },
    meta: 'v1.2 · 412 stars',
    title: 'fsm-ts — typed finite state machines, no runtime',
    lede: 'Compile-time exhaustive transitions in TypeScript. If you can construct an invalid state, this library has failed and I want to hear about it.',
    tags: ['typescript', 'state-machines', 'library'],
    lang: 'ts',
    langName: 'TypeScript',
    stars: '412',
    forks: '23',
    code: [
      '<span class="ln">12</span><span class="kw">const</span> machine = <span class="fn">defineMachine</span>({',
      '<span class="ln">13</span>  initial: <span class="st">"idle"</span>,',
      '<span class="ln">14</span>  states: { idle: { on: { START: <span class="st">"loading"</span> } } }',
      '<span class="ln">15</span>});',
    ],
  },
  {
    kind: 'essay',
    date: { day: '29', mo: 'Mar', year: '26' },
    meta: '15 min read',
    title: 'What I learned shipping a database in 90 days',
    lede: "We needed a tiny, embedded, multi-tenant log. We built one. Here's what survived contact with production, what didn't, and the three commits that I'd undo if I could.",
    tags: ['databases', 'rust', 'war-story'],
  },
  {
    kind: 'post',
    date: { day: '22', mo: 'Mar', year: '26' },
    meta: 'Short · 4 min',
    title: 'The case against feature flags as your config system',
    lede: "Six months in, your flag service is a database. A bad one. Here's what to do instead, written after the third incident caused by stale flag state.",
    tags: ['infra', 'incident', 'post'],
  },
  {
    kind: 'talk',
    date: { day: '14', mo: 'Mar', year: '26' },
    meta: 'Internal · 22 min',
    title: 'How we cut p99 by 40% by deleting code',
    lede: 'Our hottest path had grown four layers of well-meaning abstraction. The talk: how we found them, how we removed them, and the metrics graph that did most of the convincing.',
    tags: ['performance', 'internal', 'talk'],
  },
  {
    kind: 'repo',
    date: { day: '08', mo: 'Mar', year: '26' },
    meta: 'v0.9 · WIP',
    title: 'ledger-cli — a plain-text accounting CLI for engineers',
    lede: 'Because spreadsheets are append-only databases without integrity constraints, and your finances probably deserve better.',
    tags: ['go', 'cli', 'tools'],
    lang: 'go',
    langName: 'Go',
    stars: '78',
    forks: '4',
    code: [
      '<span class="ln">21</span><span class="kw">func</span> <span class="fn">Reconcile</span>(ledger *Ledger) <span class="kw">error</span> {',
      "<span class=\"ln\">22</span>  <span class=\"cm\">// every entry is double-entry, or it isn't an entry</span>",
      '<span class="ln">23</span>  <span class="kw">return</span> ledger.invariants.<span class="fn">CheckAll</span>()',
      '<span class="ln">24</span>}',
    ],
  },
  {
    kind: 'essay',
    date: { day: '01', mo: 'Mar', year: '26' },
    meta: '9 min read',
    title: 'The interview question I ask every candidate',
    lede: "It's not whiteboard. It's not system design. It's a single conversation about a bug they shipped and what they did the morning after.",
    tags: ['hiring', 'essay', 'career'],
  },
  {
    kind: 'note',
    date: { day: '24', mo: 'Feb', year: '26' },
    meta: 'Note',
    title: "Reminder to self: write the test first, even when you're sure",
    lede: "Especially when you're sure. The bugs I'm proudest of catching all started with the sentence 'I don't need a test for this.'",
    tags: ['note'],
  },
]
