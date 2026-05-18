---
slug: faster-delivery-code
title: 'Code is cheap now, still some people are delivering bad'
kind: essay
date: 2026-05-18
meta: read with patience
tags:
  - rant
---

<!-- preview:start -->

I'm still coming around bad software, and I think there's no excuses. Honestely, I think on Vero we have an incredible good flow with AI right now, and you can ask anyone, we been moving fast, but we have been intentionally critics.

<!-- preview:end -->

I think one of the biggest misunderstandings about software in the AI/agentic era is that the only goal is to ship faster.

**Yes, we can ship faster.**

Something that used to take one week can now take three days.

But the interesting part is: sometimes we should still take the full week.

Not because AI failed.
Because now coding is cheaper.

And when coding gets cheaper, the real engineering work becomes more visible.

We can finally spend time on the things we always knew were important, but were expensive to do properly:

- deep testing and E2E coverage
- better architecture
- browser reviews and performance checks
- security and edge cases
- documentation
- product validation and internal prototypes
- faster feedback loops with the team

Before, a lot of these things were easy to skip because implementation itself consumed most of the time.

Now, I can spend one or two days just making sure a feature is secure, fast, well tested, documented, and aligned with the product.

I can give an early version to the product team faster.
I can test again and again.
I can review payloads, separation of concerns, events, state, errors, patterns, and performance.

The responsibility changes.

It is less about manually writing every line of code, and more about knowing software deeply enough to direct, review, validate, and improve what is being built.

> AI makes code cheaper. But it does not make engineering cheaper.

Actually, it makes good engineering more important.

Because now the bottleneck is not only "can we build it?"

The bottleneck is:

- Do we understand what we are building?
- Is it correct?
- Is it safe?
- Is it maintainable?
- Did we test it enough?
- Does it actually solve the product problem?

For me, this is the best part of building software with AI.

Not just shipping faster.

But finally having more room to build the way we always wanted to build.

A recent example of this happened while working on an integration with an international payments provider using stablecoins.

Before AI, I would probably start by trying to get our API talking to their API as fast as possible. The priority would be to get the integration moving, so I would MVP the first version and figure out the rest while coding.

That usually means a lot of important questions get pushed to later:

- How do their webhooks actually behave in different scenarios?
- How do they handle errors?
- How do their endpoints respond to different coins, assets, and currencies?
- How do they validate international bank data?
- What happens with insufficient balance, transaction limits, or invalid `SWIFT` data?

A lot of this would be discovered on the go, jumping between docs, code, Postman, and our own implementation.

And as many engineers know, docs do not always reflect what is actually running.

This time, I could do it differently.

I gave the docs to Claude, pointed it to our codebase, with the setup we already have for our patterns, and asked it to make the simplest integration setup with their API.

While Claude was writing the first version, I had Postman open. I had their playground open. I was testing transactions, websocket events, different coins, error cases, balances, limits, and international payment data.

So when I came back to the code, I did not remember every payload, every field, or every error code.

But I understood the system much better.

I knew, for example, that I could not send `USD` to `USD` directly. One side needed to be a stablecoin, like `USDC` or `USDT`.

That changes the work completely.

Now I can plan better.
I can split tasks better.
I can prompt better.
I can review better.
I can understand what belongs to our domain and what belongs to the provider integration.

AI can write the code.

But it only becomes good code if I know what I need, if I define the right patterns, if I understand the integration, and if I can catch wrong assumptions.

Because AI can hallucinate docs, endpoints, payloads, errors, and behavior.

So my job is not to let the LLM lead.

My job is to be the ruler.

To understand the system deeply enough that the LLM can do what used to cost me most of the time two years ago:

writing the code.
