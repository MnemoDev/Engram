import { createLogger } from "../lib/logger.js";
import type { StoreBackend } from "../store/base.js";
import type { SearchRequest, SearchResult } from "../schemas/index.js";
import { rerank } from "./ranker.js";

const log = createLogger("Search");

export class SearchEngine {
  constructor(private store: StoreBackend) {}

  async query(req: SearchRequest): Promise<SearchResult[]> {
    log.debug("Searching", { query: req.query.slice(0, 60), topK: req.topK });

    const raw = await this.store.search(req.query, req.topK * 2, {
      ...(req.category ? { category: req.category } : {}),
      ...(req.agentId ? { agentId: req.agentId } : {}),
    });

    // Filter by minimum score
    const filtered = raw.filter((r) => r.score >= req.minScore);

    // Rerank: blend similarity score with recency
    const reranked = rerank(filtered, { recencyWeight: 0.15 });

    return reranked.slice(0, req.topK);
  }

  async queryRaw(query: string, topK = 5): Promise<SearchResult[]> {
    return this.query({ query, topK, minScore: 0 });
  }
}
