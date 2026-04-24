import { createLogger } from "../lib/logger.js";
import { config } from "../lib/config.js";
import type { StoreBackend } from "../store/base.js";
import type { SearchRequest, SearchResult } from "../schemas/index.js";
import { rerank } from "./ranker.js";

const log = createLogger("Search");

export class SearchEngine {
  constructor(private store: StoreBackend) {}

  async query(req: SearchRequest): Promise<SearchResult[]> {
    const topK = req.topK ?? 5;
    log.debug("Searching", { query: req.query.slice(0, 60), topK });

    const raw = await this.store.search(req.query, topK * 2, {
      ...(req.category ? { category: req.category } : {}),
      ...(req.agentId ? { agentId: req.agentId } : {}),
      ...(req.poolAddress ? { poolAddress: req.poolAddress } : {}),
      ...(req.tags?.length ? { tags: req.tags } : {}),
    });

    // Filter by minimum score
    const minScore = req.minScore ?? config.MIN_SCORE_THRESHOLD;
    const filtered = raw.filter((r) => r.score >= minScore);

    // Rerank: blend similarity score with recency
    const reranked = rerank(filtered, { recencyWeight: 0.15 });

    return reranked.slice(0, topK);
  }

  async queryRaw(query: string, topK = 5): Promise<SearchResult[]> {
    return this.query({ query, topK });
  }
}

