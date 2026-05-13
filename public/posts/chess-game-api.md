---
slug: chess-game-api
title: 'Chess game api'
kind: repo
date: 2026-05-12
meta: 1 min read
tags:
  - Elysia api
  - Ledger proof system
  - state machines
  - events
---

<!-- preview:start -->

Chess API built on an append-only event ledger. Game state is never stored directly — it's derived on every read by replaying events from the beginning. XState drives lifecycle transitions, chess.js enforces board rules. The design is just the event stream.

<!-- preview:end -->

I just literrally come up with this after watching [Criando um Ledger (entrevista para dev sênior)](https://www.youtube.com/watch?v=ktM-ocowE4Q&t=2472s) from Augusto Galego, I just thought "Well, I understand what a ledger is, I don't want to do exactly what a ledger is, but I could do something with it this knowledge"

[Github repo](https://github.com/userAugustos/chess-api)

I will not write about it, just because I did not made it to write a blog post about it. But its there.
