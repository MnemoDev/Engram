import type { SearchResult } from "../schemas/index.js";

interface RankOptions {
  recencyWeight: number; // 0–1, how much to favor newer entries
}

/**
 * Blends cosine similarity score with a recency signal.
 * Newer entries get a small boost, preventing old patterns from
 * dominating if they happen to have high semantic similarity.
 *
 * Recency decay is exponential with a 30-day half-life:
 *   recencyScore = exp(-age / halfLife)
 * This is more aggressive than linear decay — an entry from 90 days ago
 * scores ~0.05 recency vs ~0.33 with a linear model, preventing stale
 * patterns from anchoring recent decisions.
 */
const RECENCY_HALFLIFE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function rerank(results: SearchResult[], opts: RankOptions): SearchResult[] {
  if (results.length === 0) return [];

  const now = Date.now();

  return results
    .map((r) => {
      const age = now - r.memory.createdAt;
      const recencyScore = Math.exp(-age / RECENCY_HALFLIFE_MS);
      const blended =
        r.score * (1 - opts.recencyWeight) + recencyScore * opts.recencyWeight;
      return { ...r, score: blended };
    })
    .sort((a, b) => b.score - a.score);
}

