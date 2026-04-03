# CLAUDE.md

## What this is

Engram is a RAG memory layer. Agents POST memories to `/memories`, query them via `/search`, and get back semantically ranked results. ChromaDB stores vectors; Engram handles chunking, TTL, deduplication, hooks, and re-ranking on top.

## Layout

```
index.ts          ← entry point: init store, start API, schedule prune
schemas/          ← Zod schemas for all types (Memory, SearchRequest, etc.)
store/
  base.ts         ← StoreBackend interface
  chroma.ts       ← ChromaDB backend (production)
  memory.ts       ← In-memory backend (dev/testing, no Chroma needed)
retrieval/
  search.ts       ← SearchEngine: query + filter
  ranker.ts       ← rerank: blend similarity score with recency signal
pipeline/
  chunker.ts      ← split long text into overlapping chunks
  ingest.ts       ← IngestionPipeline: hooks → chunk → store
hooks/
  index.ts        ← hook registry + built-in sanitize hook
api/
  server.ts       ← Bun HTTP server: /health /stats /search /memories /prune
lib/
  config.ts       ← Zod env validation
  logger.ts       ← structured JSONL logger
examples/
  basic.ts        ← HTTP API usage example
tests/
```

## Dev commands

```bash
bun run dev           # hot reload
bun run test          # vitest (uses in-memory store — no Chroma needed)
bun run example       # run examples/basic.ts (needs server running)
bun run lint          # tsc type check
```

## Switching backends

`STORE_BACKEND=memory` — no Chroma required, uses in-memory store.
`STORE_BACKEND=chroma` — requires `docker-compose up chromadb -d` first.

## Adding a hook

```ts
import { registerHook } from "./hooks/index.js";
registerHook("before:ingest", (req) => ({ ...req, content: req.content.toUpperCase() }));
```

Available events: `before:ingest`, `after:ingest`, `before:search`, `after:search`.

