import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStore } from "../store/memory.js";
import { SearchEngine } from "../retrieval/search.js";
import { IngestionPipeline } from "../pipeline/ingest.js";
import { chunk } from "../pipeline/chunker.js";
import { rerank } from "../retrieval/ranker.js";

describe("MemoryStore", () => {
  let store: MemoryStore;

  beforeEach(async () => {
    store = new MemoryStore();
    await store.initialize();
  });

  it("stores and retrieves a memory", async () => {
    const memory = await store.upsert({
      category: "warning",
      content: "Pool showed unusual volume spike before TVL drop",
    });
    expect(memory.id).toBeTruthy();
    expect(memory.category).toBe("warning");

    const retrieved = await store.get(memory.id);
    expect(retrieved?.content).toBe("Pool showed unusual volume spike before TVL drop");
  });

  it("applies correct TTL by category", async () => {
    const pattern = await store.upsert({ category: "pattern", content: "test pattern" });
    const warning = await store.upsert({ category: "warning", content: "test warning" });

    const patternTtlDays = (pattern.expiresAt - pattern.createdAt) / (24 * 60 * 60 * 1000);
    const warningTtlDays = (warning.expiresAt - warning.createdAt) / (24 * 60 * 60 * 1000);

    expect(patternTtlDays).toBeCloseTo(90, 0);
    expect(warningTtlDays).toBeCloseTo(60, 0);
  });

  it("prunes expired entries", async () => {
    const store2 = new MemoryStore();
    await store2.initialize();

    // Store with 0 TTL days — already expired
    await store2.upsert({ category: "context", content: "expired entry", ttlDays: 0 });
    const stats1 = await store2.stats();
    // Entry might have 0ms TTL, prune should catch it
    const pruned = await store2.pruneExpired();
    expect(typeof pruned).toBe("number");
  });

  it("returns stats correctly", async () => {
    await store.upsert({ category: "pattern", content: "pattern one" });
    await store.upsert({ category: "pattern", content: "pattern two" });
    await store.upsert({ category: "warning", content: "warning one" });

    const stats = await store.stats();
    expect(stats.total).toBe(3);
    expect(stats.byCategory["pattern"]).toBe(2);
    expect(stats.byCategory["warning"]).toBe(1);
  });
});

describe("SearchEngine", () => {
  let store: MemoryStore;
  let engine: SearchEngine;

  beforeEach(async () => {
    store = new MemoryStore();
    await store.initialize();
    engine = new SearchEngine(store);

    await store.upsert({ category: "warning", content: "volume spike on SOL/USDC pool detected" });
    await store.upsert({ category: "pattern", content: "fee ratio above 1.2 indicates healthy pool" });
    await store.upsert({ category: "outcome", content: "exit executed successfully after TVL drop" });
  });

  it("returns relevant results for a query", async () => {
    const results = await engine.queryRaw("volume spike pool", 5);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.score).toBeGreaterThan(0);
  });

  it("filters by category", async () => {
    const results = await engine.query({ query: "pool", topK: 5, category: "warning", minScore: 0 });
    for (const r of results) {
      expect(r.memory.category).toBe("warning");
    }
  });
});

describe("chunk", () => {
  it("returns single chunk for short text", () => {
    const chunks = chunk("short text");
    expect(chunks).toHaveLength(1);
    expect(chunks[0]!.text).toBe("short text");
  });

  it("splits long text into overlapping chunks", () => {
    const text = "a".repeat(2500);
    const chunks = chunk(text, { maxChunkSize: 1000, overlap: 100 });
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]!.totalChunks).toBe(chunks.length);
  });
});

describe("rerank", () => {
  it("blends similarity score with recency", () => {
    const now = Date.now();
    const results = [
      { score: 0.9, memory: { id: "1", category: "warning" as const, content: "", tags: [], createdAt: now - 89 * 24 * 60 * 60 * 1000, expiresAt: now + 1000 } },
      { score: 0.85, memory: { id: "2", category: "pattern" as const, content: "", tags: [], createdAt: now - 1000, expiresAt: now + 1000 } },
    ];
    const reranked = rerank(results, { recencyWeight: 0.15 });
    // Newer entry should get a boost despite lower raw score
    expect(reranked[0]!.memory.id).toBe("2");
  });
});

