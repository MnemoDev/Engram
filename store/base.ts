import type { Memory, SearchResult, StoreStats, UpsertRequest } from "../schemas/index.js";

export interface StoreBackend {
  initialize(): Promise<void>;
  upsert(req: UpsertRequest): Promise<Memory>;
  search(query: string, topK: number, filters?: Partial<Pick<Memory, "category" | "agentId">>): Promise<SearchResult[]>;
  get(id: string): Promise<Memory | null>;
  delete(id: string): Promise<void>;
  pruneExpired(): Promise<number>;
  stats(): Promise<StoreStats>;
}
