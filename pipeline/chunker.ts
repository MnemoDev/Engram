export interface Chunk {
  text: string;
  index: number;
  totalChunks: number;
}

export interface ChunkOptions {
  maxChunkSize: number;  // chars
  overlap: number;       // chars of overlap between chunks
}

const DEFAULTS: ChunkOptions = { maxChunkSize: 1000, overlap: 100 };

/**
 * Splits long text into overlapping chunks for embedding.
 * Short texts (< maxChunkSize) return a single chunk unchanged.
 */
export function chunk(text: string, opts: Partial<ChunkOptions> = {}): Chunk[] {
  const { maxChunkSize, overlap } = { ...DEFAULTS, ...opts };

  if (text.length <= maxChunkSize) {
    return [{ text, index: 0, totalChunks: 1 }];
  }

  const chunks: Chunk[] = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + maxChunkSize, text.length);
    // Prefer to break at a sentence boundary to avoid splitting mid-thought.
    // Scan back up to 120 chars for a period/newline if we're not at the end.
    if (end < text.length) {
      const boundary = text.lastIndexOf(". ", end);
      if (boundary > start + maxChunkSize / 2) {
        end = boundary + 2; // include the period and space
      }
    }
    chunks.push({ text: text.slice(start, end), index: chunks.length, totalChunks: 0 });
    if (end >= text.length) break;
    start = end - overlap;
  }

  // Backfill totalChunks
  return chunks.map((c) => ({ ...c, totalChunks: chunks.length }));
}

