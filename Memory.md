# Memory

Design decisions and lessons from building Engram.

## Why two backends

The in-memory backend exists for one reason: tests should not require a running Chroma instance. All 12 unit tests use `MemoryStore` and run offline. The `ChromaStore` has integration tests that require `docker-compose up chromadb -d`.

## Deduplication threshold

0.92 cosine similarity was chosen empirically. At 0.85 too many distinct warnings were merged. At 0.95 too many true duplicates slipped through. Tune via `SIMILARITY_MERGE_THRESHOLD` in `store/chroma.ts` if your use case has denser memory clusters.

## Recency weight in reranker

15% recency weight. Higher values cause newer but less relevant memories to surface — bad for pattern retrieval where the most similar pattern matters more than the newest one. Lower values make the system forget to prioritize recent warnings.

## TTL policy rationale

- `pattern` 90d — recurring market behaviour takes time to establish and validate
- `warning` 60d — pool-specific red flags expire faster since pool conditions change
- `outcome` 180d — execution outcomes are the most durable training signal
- `context` 30d — ephemeral shared state, expires quickly
