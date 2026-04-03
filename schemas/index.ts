import { z } from "zod";

export const MemoryCategorySchema = z.enum(["pattern", "warning", "outcome", "context"]);
export type MemoryCategory = z.infer<typeof MemoryCategorySchema>;

export const MemorySchema = z.object({
  id: z.string().uuid(),
  category: MemoryCategorySchema,
  content: z.string().min(1).max(4000),
  agentId: z.string().optional(),
  poolAddress: z.string().optional(),
  tags: z.array(z.string()).default([]),
  outcome: z.enum(["profit", "loss", "neutral"]).optional(),
  pnlUsd: z.number().optional(),
  confidence: z.number().min(0).max(1).optional(),
  createdAt: z.number(),
  expiresAt: z.number(),
});

export type Memory = z.infer<typeof MemorySchema>;

export const UpsertRequestSchema = z.object({
  category: MemoryCategorySchema,
  content: z.string().min(1),
  agentId: z.string().optional(),
  poolAddress: z.string().optional(),
  tags: z.array(z.string()).optional(),
  outcome: z.enum(["profit", "loss", "neutral"]).optional(),
  pnlUsd: z.number().optional(),
  confidence: z.number().min(0).max(1).optional(),
  ttlDays: z.number().min(1).max(365).optional(),
});

export type UpsertRequest = z.infer<typeof UpsertRequestSchema>;

export const SearchRequestSchema = z.object({
  query: z.string().min(1),
  topK: z.number().min(1).max(50).default(5),
  category: MemoryCategorySchema.optional(),
  agentId: z.string().optional(),
  minScore: z.number().min(0).max(1).default(0),
});

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const SearchResultSchema = z.object({
  memory: MemorySchema,
  score: z.number(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const StoreStatsSchema = z.object({
  total: z.number(),
  byCategory: z.record(MemoryCategorySchema, z.number()),
  oldestEntry: z.number().optional(),
  newestEntry: z.number().optional(),
  expiredPruned: z.number(),
});

export type StoreStats = z.infer<typeof StoreStatsSchema>;

