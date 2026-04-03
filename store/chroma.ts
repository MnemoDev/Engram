import { ChromaClient, type Collection } from "chromadb";
import { randomUUID } from "crypto";
import { createLogger } from "../lib/logger.js";
import { config } from "../lib/config.js";
import type { StoreBackend } from "./base.js";
import type { Memory, SearchResult, StoreStats, UpsertRequest } from "../schemas/index.js";

const log = createLogger("ChromaStore");

const TTL_DAYS: Record<string, number> = {
  pattern: 90,
  warning: 60,
  outcome: 180,
  context: 30,
};

const SIMILARITY_MERGE_THRESHOLD = 0.92;

export class ChromaStore implements StoreBackend {
  private client: ChromaClient;
  private collection: Collection | null = null;
  private pruneCount = 0;

  constructor() {
    this.client = new ChromaClient({ path: config.CHROMA_URL });
  }

  async initialize(): Promise<void> {
    try {
      this.collection = await this.client.getOrCreateCollection({
        name: config.COLLECTION_NAME,
        metadata: { description: "Engram RAG memory store" },
      });
      const count = await this.collection.count();
      log.info("Store initialized", { collection: config.COLLECTION_NAME, entries: count });
    } catch (err) {
      log.error("Failed to connect to Chroma", { err });
      throw err;
    }
  }

  async upsert(req: UpsertRequest): Promise<Memory> {
    if (!this.collection) throw new Error("Store not initialized");

    const now = Date.now();
    const ttlDays = req.ttlDays ?? TTL_DAYS[req.category] ?? 90;
    const expiresAt = now + ttlDays * 24 * 60 * 60 * 1000;

    // Near-duplicate check
    const similar = await this.collection.query({
      queryTexts: [req.content],
      nResults: 1,
      ...(req.category ? { where: { category: req.category } } : {}),
    });

    const topDist = similar.distances?.[0]?.[0];
    if (topDist !== undefined && topDist < 1 - SIMILARITY_MERGE_THRESHOLD) {
      const existingId = String(similar.ids[0]?.[0] ?? "");
      log.debug("Merging near-duplicate", { existingId, distance: topDist });
      await this.collection.update({
        ids: [existingId],
        metadatas: [{ expiresAt, mergedAt: now }],
      });
      const existing = await this.get(existingId);
      if (existing) return existing;
    }

    const id = randomUUID();
    const meta: Record<string, string | number | boolean> = {
      category: req.category,
      createdAt: now,
      expiresAt,
      ...(req.agentId ? { agentId: req.agentId } : {}),
      ...(req.poolAddress ? { poolAddress: req.poolAddress } : {}),
      ...(req.tags?.length ? { tags: req.tags.join(",") } : {}),
      ...(req.outcome ? { outcome: req.outcome } : {}),
      ...(req.pnlUsd !== undefined ? { pnlUsd: req.pnlUsd } : {}),
      ...(req.confidence !== undefined ? { confidence: req.confidence } : {}),
    };

    await this.collection.add({ ids: [id], documents: [req.content], metadatas: [meta] });
    log.debug("Memory stored", { id, category: req.category });

    return this.metaToMemory(id, req.content, meta);
  }

  async search(
    query: string,
    topK: number,
    filters?: Partial<Pick<Memory, "category" | "agentId">>
  ): Promise<SearchResult[]> {
    if (!this.collection) throw new Error("Store not initialized");

    const where: Record<string, unknown> = {};
    if (filters?.category) where["category"] = filters.category;
    if (filters?.agentId) where["agentId"] = filters.agentId;

    const results = await this.collection.query({
      queryTexts: [query],
      nResults: topK * 2,
      ...(Object.keys(where).length > 0 ? { where } : {}),
    });

    const now = Date.now();
    const searchResults: SearchResult[] = [];
    const ids = results.ids[0] ?? [];
    const docs = results.documents[0] ?? [];
    const metas = results.metadatas[0] ?? [];
    const distances = results.distances?.[0] ?? [];

    for (let i = 0; i < ids.length; i++) {
      const meta = metas[i] as Record<string, unknown>;
      if (Number(meta["expiresAt"] ?? 0) < now) continue;

      const score = 1 - Number(distances[i] ?? 1);
      const memory = this.metaToMemory(String(ids[i]), String(docs[i] ?? ""), meta);
      searchResults.push({ memory, score });
      if (searchResults.length === topK) break;
    }

    return searchResults;
  }

  async get(id: string): Promise<Memory | null> {
    if (!this.collection) throw new Error("Store not initialized");
    const result = await this.collection.get({ ids: [id] });
    if (!result.ids.length) return null;
    const meta = result.metadatas[0] as Record<string, unknown>;
    return this.metaToMemory(id, String(result.documents[0] ?? ""), meta);
  }

  async delete(id: string): Promise<void> {
    if (!this.collection) throw new Error("Store not initialized");
    await this.collection.delete({ ids: [id] });
  }

  async pruneExpired(): Promise<number> {
    if (!this.collection) throw new Error("Store not initialized");
    const now = Date.now();
    const all = await this.collection.get();
    const expired = all.ids.filter((_, i) => {
      const meta = all.metadatas[i] as Record<string, unknown>;
      return Number(meta["expiresAt"] ?? 0) < now;
    });
    if (expired.length > 0) {
      await this.collection.delete({ ids: expired as string[] });
      this.pruneCount += expired.length;
      log.info("Pruned expired entries", { count: expired.length });
    }
    return expired.length;
  }

  async stats(): Promise<StoreStats> {
    if (!this.collection) throw new Error("Store not initialized");
    const all = await this.collection.get();
    const byCategory: Record<string, number> = {};
    let oldest = Infinity;
    let newest = 0;

    for (const meta of all.metadatas) {
      const m = meta as Record<string, unknown>;
      const cat = String(m["category"] ?? "unknown");
      byCategory[cat] = (byCategory[cat] ?? 0) + 1;
      const created = Number(m["createdAt"] ?? 0);
      if (created < oldest) oldest = created;
      if (created > newest) newest = created;
    }

    return {
      total: all.ids.length,
      byCategory: byCategory as StoreStats["byCategory"],
      oldestEntry: oldest === Infinity ? undefined : oldest,
      newestEntry: newest === 0 ? undefined : newest,
      expiredPruned: this.pruneCount,
    };
  }

  private metaToMemory(id: string, content: string, meta: Record<string, unknown>): Memory {
    return {
      id,
      category: String(meta["category"] ?? "context") as Memory["category"],
      content,
      agentId: meta["agentId"] ? String(meta["agentId"]) : undefined,
      poolAddress: meta["poolAddress"] ? String(meta["poolAddress"]) : undefined,
      tags: meta["tags"] ? String(meta["tags"]).split(",").filter(Boolean) : [],
      outcome: meta["outcome"] as Memory["outcome"],
      pnlUsd: meta["pnlUsd"] !== undefined ? Number(meta["pnlUsd"]) : undefined,
      confidence: meta["confidence"] !== undefined ? Number(meta["confidence"]) : undefined,
      createdAt: Number(meta["createdAt"] ?? 0),
      expiresAt: Number(meta["expiresAt"] ?? 0),
    };
  }
}
