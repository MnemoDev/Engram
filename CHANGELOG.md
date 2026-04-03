# Changelog

## [1.0.0] — 2026-04-03

### Added
- Two store backends: ChromaDB (production) + in-memory (dev/test)
- Similarity-based deduplication — entries with cosine similarity > 0.92 are merged
- TTL by category: pattern 90d · warning 60d · outcome 180d · context 30d
- IngestionPipeline with chunking (1000 char chunks, 100 char overlap)
- Hook system with `before:ingest` / `after:ingest` events
- SearchEngine with recency-blended reranking (15% recency weight)
- REST API: POST /memories · POST /search · DELETE /memories/:id · POST /prune · GET /stats
- Zod validation on all API inputs
- 12 unit tests — all run without Chroma using the in-memory backend

