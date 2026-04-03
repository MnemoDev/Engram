import type { SearchResult } from "../schemas/index.js";

interface RankOptions {
  recencyWeight: number; // 0–1, how much to favor newer entries
}

/**
 * Blends cosine similarity score with a recency signal.
 * Newer entries get a small boost, preventing old patterns from
 * dominating if they happen to have high semantic similarity.
 */
export function rerank(results: SearchResult[], opts: RankOptions): SearchResult[] {
  if (results.length === 0) return [];

  const now = Date.now();
  const maxAge = 90 * 24 * 60 * 60 * 1000; // 90 days in ms

  return results
    .map((r) => {
      const age = now - r.memory.createdAt;
      const recencyScore = Math.max(0, 1 - age / maxAge);
      const blended =
        r.score * (1 - opts.recencyWeight) + recencyScore * opts.recencyWeight;
      return { ...r, score: blended };
    })
    .sort((a, b) => b.score - a.score);
}

