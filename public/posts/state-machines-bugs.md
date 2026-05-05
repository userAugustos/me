---
slug: state-machines-bugs
title: "On state machines, and why your bug isn't where you think it is"
kind: essay
date: 2026-04-30
meta: 12 min read
tags:
  - state-machines
  - rust
  - essay
---

<!-- preview:start -->
Most production bugs I've debugged in the last decade aren't logic errors. They're transitions that were never named.

```ts
const machine = createMachine({
  initial: 'idle',
  states: {
    idle: { on: { START: 'loading' } },
    loading: { on: { DONE: 'ready', FAIL: 'failed' } },
  },
})
```
<!-- preview:end -->

# On state machines, and why your bug isn't where you think it is

Most production bugs I've debugged in the last decade weren't caused by a bad `if` statement. They were caused by a state transition nobody had named.

The expensive bugs tend to happen in the space between nouns. A payment is not exactly pending, not exactly settled, not exactly failed. A user is halfway through onboarding. A deploy has started but not yet become the active version. The code usually knows about these moments, but only as scattered booleans.

Making the implicit explicit does not make software ceremonious. It makes it debuggable.

```rust
enum OrderState {
    Draft,
    AwaitingPayment,
    Paid,
    Fulfilled,
    Cancelled,
}
```

The real value is not the enum. The value is being forced to answer: which transitions are allowed, which ones are impossible, and what do we do when production proves us wrong?
