import type { Memory, SearchResult, StoreStats, UpsertRequest } from "../schemas/index.js";

export type SearchFilters = Partial<Pick<Memory, "category" | "agentId" | "poolAddress">> & {
  tags?: string[];
};

export interface StoreBackend {
  initialize(): Promise<void>;
  upsert(req: UpsertRequest): Promise<Memory>;
  search(query: string, topK: number, filters?: SearchFilters): Promise<SearchResult[]>;
  get(id: string): Promise<Memory | null>;
  delete(id: string): Promise<void>;
  pruneExpired(): Promise<number>;
  stats(): Promise<StoreStats>;
}

