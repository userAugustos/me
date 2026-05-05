---
slug: idempotency-property
title: Idempotency is a property, not a header
kind: talk
date: 2026-04-11
meta: QCon Brasil · 38 min · video
tags:
  - talk
  - apis
  - qcon
---

<!-- preview:start -->
Talk on building APIs that survive retries, network partitions, and the inevitable client that wraps your endpoint in a `while true` loop.
<!-- preview:end -->

# Idempotency is a property, not a header

The header is a hint. The property is a guarantee.

This talk walks through the difference between accepting an `Idempotency-Key` and actually designing an operation that can be safely retried. The ugly part is that most failures happen after the side effect and before the response.

```txt
client sends request
server commits side effect
network drops response
client retries
```

That diagram is where the design starts.
