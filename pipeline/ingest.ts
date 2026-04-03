import { createLogger } from "../lib/logger.js";
import type { StoreBackend } from "../store/base.js";
import type { Memory, UpsertRequest } from "../schemas/index.js";
import { chunk } from "./chunker.js";
import { applyHooks } from "../hooks/index.js";

const log = createLogger("Ingest");

export class IngestionPipeline {
  constructor(private store: StoreBackend) {}

  /**
   * Ingest a single memory entry.
   * Applies pre-hooks, chunks if needed, stores, applies post-hooks.
   */
  async ingest(req: UpsertRequest): Promise<Memory[]> {
    // Pre-ingest hooks
    const processed = await applyHooks("before:ingest", req);

    const chunks = chunk(processed.content, { maxChunkSize: 1000, overlap: 100 });
    const memories: Memory[] = [];

    for (const c of chunks) {
      const chunkReq: UpsertRequest = {
        ...processed,
        content:
          chunks.length > 1
            ? `[${c.index + 1}/${c.totalChunks}] ${c.text}`
            : c.text,
      };

      const memory = await this.store.upsert(chunkReq);
      memories.push(memory);
    }

    // Post-ingest hooks
    await applyHooks("after:ingest", memories);

    log.debug("Ingested", {
      chunks: memories.length,
      category: req.category,
      contentLength: req.content.length,
    });

    return memories;
  }

  /**
   * Bulk ingest multiple entries.
   */
  async ingestBatch(requests: UpsertRequest[]): Promise<Memory[]> {
    const results = await Promise.all(requests.map((r) => this.ingest(r)));
    return results.flat();
  }
}

