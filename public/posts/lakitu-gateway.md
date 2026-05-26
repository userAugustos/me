---
slug: lakitu-gateway
title: 'Lakitu: agent control gateway'
kind: repo
date: 2026-05-23
meta: 1 min read
tags:
  - Turbo repo
  - Palm verification
  - KYA
  - AI Agents
---

<!-- preview:start -->

Lakitu is an agent validation and management gateway. Agents are created with Ed25519 keys, registered through Clawkey, and every action request goes through signature validation, replay protection, owner verification with VeryAI, permissions, policy limits, and audit logging before the gateway decides if it should allow, deny, or require approval.

<!-- preview:end -->

Lakitu is an agent validation and management gateway. Here you can't fool him

![Lakitu mad with you](https://media1.tenor.com/m/dBFWIJC8ScIAAAAC/lakitu-lakitu-wrong-way.gif)

Agents are created with Ed25519 keys, registered through [Clawkey](https://ag9.ai/), and every action request goes through signature validation, replay protection, owner verification with VeryAI, permissions, policy limits, and audit logging before the gateway decides if it should allow, deny, or require approval.

It uses turbo repo with a React 19 SPA, Bun + Elysia API, Drizzle with SQLite(the best you can have), and shadcn/Tailwind.

The interesting part is the gateway pipeline: agents do not just call actions directly, every request needs to prove who signed it, that it is fresh, that the agent is active and registered, and that the owner passed identity verification.

[Check it's flow here](https://github.com/userAugustos/lakitu/blob/main/README.md)

Permissions are granted per agent and per action, with policy limits like max amounts, allowed hours, and approval-required flows. When approval is required, Lakitu creates a pending action, notifies the owner by email, and records the whole decision in the audit trail.

[Github repo](https://github.com/userAugustos/lakitu)

I will not write about it, just because I did a lot on the repo README already, by reviewing correctly the codebase and the mermaid diagrams. its there learn what you can from it, if you find something to improve/fix don't send a message, send patches.
