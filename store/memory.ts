/**
 * In-memory store backend — no external dependencies.
 * Ideal for testing and local development without Chroma running.
 */
import { randomUUID } from "crypto";
import type { StoreBackend } from "./base.js";
import type { Memory, SearchResult, StoreStats, UpsertRequest } from "../schemas/index.js";

const TTL_DAYS: Record<string, number> = {
  pattern: 90, warning: 60, outcome: 180, context: 30,
};

export class MemoryStore implements StoreBackend {
  private entries = new Map<string, Memory>();
  private pruneCount = 0;

  async initialize(): Promise<void> {
    // No-op
  }

  async upsert(req: UpsertRequest): Promise<Memory> {
    const now = Date.now();
    const ttlDays = req.ttlDays ?? TTL_DAYS[req.category] ?? 90;

    const memory: Memory = {
      id: randomUUID(),
      category: req.category,
      content: req.content,
      agentId: req.agentId,
      poolAddress: req.poolAddress,
      tags: req.tags ?? [],
      outcome: req.outcome,
      pnlUsd: req.pnlUsd,
      confidence: req.confidence,
      createdAt: now,
      expiresAt: now + ttlDays * 24 * 60 * 60 * 1000,
    };

    this.entries.set(memory.id, memory);
    return memory;
  }

  async search(query: string, topK: number, filters?: Partial<Pick<Memory, "category" | "agentId">>): Promise<SearchResult[]> {
    const now = Date.now();
    const queryTerms = query.toLowerCase().split(/\s+/);

    const results: SearchResult[] = [];

    for (const memory of this.entries.values()) {
      if (memory.expiresAt < now) continue;
      if (filters?.category && memory.category !== filters.category) continue;
      if (filters?.agentId && memory.agentId !== filters.agentId) continue;

      // Simple TF-based score (no real embeddings — for dev/test only)
      const text = memory.content.toLowerCase();
      const matches = queryTerms.filter((t) => text.includes(t)).length;
      const score = matches / queryTerms.length;

      if (score > 0) results.push({ memory, score });
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  async get(id: string): Promise<Memory | null> {
    return this.entries.get(id) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.entries.delete(id);
  }

  async pruneExpired(): Promise<number> {
    const now = Date.now();
    let count = 0;
    for (const [id, m] of this.entries) {
      if (m.expiresAt < now) { this.entries.delete(id); count++; }
    }
    this.pruneCount += count;
    return count;
  }

  async stats(): Promise<StoreStats> {
    const now = Date.now();
    const active = [...this.entries.values()].filter((m) => m.expiresAt > now);
    const byCategory: Record<string, number> = {};
    let oldest = Infinity;
    let newest = 0;

    for (const m of active) {
      byCategory[m.category] = (byCategory[m.category] ?? 0) + 1;
      if (m.createdAt < oldest) oldest = m.createdAt;
      if (m.createdAt > newest) newest = m.createdAt;
    }

    return {
      total: active.length,
      byCategory: byCategory as StoreStats["byCategory"],
      oldestEntry: oldest === Infinity ? undefined : oldest,
      newestEntry: newest === 0 ? undefined : newest,
      expiredPruned: this.pruneCount,
    };
  }
}
