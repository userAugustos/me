---
slug: output-not-deterministic
title: "The output is not deterministic, I don't expect it to be"
kind: essay
date: 2026-08-24
meta: guardrails over review
tags:
  - AI Agents
  - code review
  - e2e tests
  - guardrails
---
<!-- preview:start -->

I don't verify every line of generated code anymore. I still read all of it, but at scroll speed. Three years ago a pull request cost me forty or fifty minutes of tracing every `if` by hand, and I stopped doing that on purpose.

<!-- preview:end -->

I don't verify every line of generated code anymore.

I still read all of it. I scroll the pull request and look at the changes. What disappeared is the audit: tracing each branch by hand, reading every condition until I had convinced myself the logic is good. That used to be forty or fifty minutes on a PR. Now it is a few minutes of reading, and the verifying happens somewhere else.

That sounds stupid, but I can back it up.

The same prompt, on the same codebase, run twice, produces different code. Sometimes slightly different, sometimes structurally different. That is not a defect I can prompt away, and it is not a sign the model is dumb. Models are perfectly capable of writing code the way I want it, but they're not deterministic. They are just not going to do it identically every time.

So I stopped trying to make the generation deterministic. I can't fix the generation. What I can decide is what the result has to survive before it ships.

And the bar I hold is not "no bugs". It is narrower, and much more useful:

> Nothing I know about surprises me.

Every path I know, every click order, every common mistake, every error I can imagine being thrown: if I know it, the plan covers it, the tests cover it, and the interface handles it. On canyon-code we have not seen an unexpected error screen yet. Not because nothing goes wrong. But loading, error and success are handled every time, so when something fails, it fails into a state we designed.

Problems only gets to play in the space I did not map. So the work is making that space smaller, not making the model better (I can't do that).

The bar moves, too. Sometimes I hold it lower on purpose, because time matters more than polish this week. Sometimes I'm not merging a PR, mine or from a intern, because of a comment; Nobody hands you the bar. You set it per PR and you own where you set it.

The first thing people try is planning harder. Sit down with the model, write a long plan, expect the code to come out the way you pictured it.

It doesn't work

A plan only controls the code line by line if you plan every line. And a plan that specifies every condition is just code written in prose: you still had to think it, read it, and approve it, one line at a time. You paid the full price of writing it yourself, in a worse language (Yes, if I'm going to write the code, I prefer not to write the prompt, neither talk about it, just start writing, prompt to then read each line, I should be writing it myself).

So plans stay at their real altitude. The goal, the technical approach, the contracts, the tests, the details that matter. Nothing at that altitude decides how a given branch gets written.

A codebase (might) do.

**The plan controls what gets built. The codebase controls the patterns.**

An opinionated codebase steers a good model harder than any instruction I can write. Patterns to copy, scaffolders for the boring wiring, forbidden shapes, one obvious place for each kind of code. The model reads what is already there and follows it, because following local precedent is the cheapest correct thing it can do.

That is why, for consistency, I care more about the codebase than about the plan.

But planning still comes first, because architecture decisions happen before there is any pattern to copy. On ykb the tech lead pipeline has a step for exactly that. Before any logic exists, it writes only the types and a map of `@TODO` comments at every site that will change. No function bodies, no queries, no wiring. It does not compile, on purpose, and it gets committed with `--no-verify` because of that.

That is the commit I review carefully. Shape and intent, while both are still cheap to change.

Then the implementation lands, and I scroll it.

What I am looking for on that scroll is not if the code will get the result I expect. It is the tests, the drift of the patterns and clear problems. I read the e2e and integration tests and I check one thing: is the path the test describes the path the code actually follows? A test that names a flow and then asserts something next to it is the most common way for broken work to look finished.

Which is the reason for the two guardrails I trust most:

The first one guards the tests, not the code.

Models write tests that pass. That is the incentive, and some months ago it was constant: empty assertions, tests that exercise nothing, expectations rewritten until green. A suite like that is worse than no suite, because it produces confidence.

So the expected database state is declared up front, committed as a readable fingerprint, and once the suite finishes the real state has to match it:

```
## row_counts
accounts:3
orders:12
ledger_entries:26

## balances
account_a:1500.00
account_b:0.00
```

When a test claims it created an order and settled it, I can see the order and the settled balance. Or I can see that nothing moved. You read consequences instead of lines.

Two details in there are the honest part.

The exclusion list. Some tables are not stable across runs: the test runner retries, and a retried test that recreates a record inflates junction counts. Ephemeral fixtures get random suffixes. To build a stable check I had to enumerate which parts are unstable and carve them out.

And the agent is not allowed to regenerate that file. It is not in branch protection, nothing auto-fixes it, and the heavy dump gets regenerated by me, locally. **A guardrail the model can rewrite to make itself pass is not a guardrail.**

This is what caught the real ones on vero: workers, scheduled payments, withdrawals between different currencies. Bugs that a human reviewer and an LLM reviewer would both have scrolled straight past.

The second guardrail is running the real thing.

If the change is reachable through the API, prove it with real requests against a booted server. Walk the happy path as a user, then attack every guardrail you can reach. Hit the limit. Hit an owned resource as the wrong user. Post invalid input.

And when a third party is involved, go to their sandbox. Most of my work on vero and ykb depends on providers, and provider docs are stale, or they quietly leave out the thing that will break you. I learned that before AI. It is worse now, because a model will describe an endpoint's behavior with total confidence. "It works, I fetched xy.com" is not evidence. The sandbox is evidence (even that, we know sometimes it's different from prod).

The last piece is who reviews.

A fresh agent with no context, reviewing a PR it did not write, is dramatically better than the agent that wrote it. Not because it is smarter, because it has no stake in the plan (like humans).

LLMs bias to their prompt exactly like people bias to their own pull request. Ask a model to review its own decisions and you get a defense of those decisions, hand the same diff to something with no history, and it finds things.

One example. Our codebases forbid `any`, and forbid ternaries for conditional rendering in JSX, models still add them, and I don't think they forget the rule, I think they price it: they weigh the refactor against the rule and decide the rule is not worth the work right now. That is a budget decision, not a comprehension failure, which is why asking them to check their own work cannot catch it, a stranger has no budget to protect.

None of this touches taste or decisions.

Correctness has assertions, intent does notm a feature can pass every gate and still solve the wrong problem, or be right and feel wrong.

So there are parts I keep. When the work is genuinely new, a first integration, a first worker, anything with no precedent in the repo, I read all of it properly. The PR is mine and the merge is mine, and that did not get delegated anywhere.

And I open the app and use it, every time (of course, I don't do it, when it's a change that isn't on user land).

That part is not delegable, and not because agents are bad at it, because it is a trade-off space with no correct answer, sometimes you watch a query load, accept that you cannot make it faster, and change how the loading feels instead, no script has an opinion about that, just because a e2e passed, it doesn't mean it's what the customer wants.

Code being cheap changes how u should be working, rejecting working, tested, green code used to be the expensive decision, now it is the cheap one. And sometimes using the feature is how I find out I was wrong about what to build, which sends it back to the plan.  


Honestly, if u have a frontier model, and you're not coding how u would like to at the same time getting the result the way u would want to, you need to align time and effort, code is cheap, we should be able to be correctly covering integrations, interactions, error, loading, we should be able to handle bigger goals, to have clean interfaces, your time should be caring about the quality of the code u produce, and the result that code gives.

That loop is the job now. Plan at the right altitude, let the codebase carry the shape, let the guardrails do the verifying, review the code, then go and use the thing yourself.

The last part I can't hand to you. Your product, your users, your call. That is the part worth getting better at.