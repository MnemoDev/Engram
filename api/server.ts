import { createLogger } from "../lib/logger.js";
import { config } from "../lib/config.js";
import type { StoreBackend } from "../store/base.js";
import { SearchEngine } from "../retrieval/search.js";
import { IngestionPipeline } from "../pipeline/ingest.js";
import { SearchRequestSchema, UpsertRequestSchema } from "../schemas/index.js";

const log = createLogger("API");

export function startServer(store: StoreBackend): ReturnType<typeof Bun.serve> {
  const search = new SearchEngine(store);
  const pipeline = new IngestionPipeline(store);

  const server = Bun.serve({
    port: config.API_PORT,
    async fetch(req) {
      const url = new URL(req.url);
      const method = req.method;

      if (url.pathname === "/health" && method === "GET") {
        return Response.json({ status: "ok", ts: Date.now() });
      }

      if (url.pathname === "/metrics" && method === "GET") {
        const stats = await store.stats();
        const lines = [
          "# HELP engram_entries_total Total stored memory entries",
          "# TYPE engram_entries_total gauge",
          `engram_entries_total ${stats.total}`,
          ...Object.entries(stats.byCategory).map(
            ([category, count]) => `engram_entries_by_category{category="${category}"} ${count}`
          ),
          "# HELP engram_pruned_total Total expired entries pruned",
          "# TYPE engram_pruned_total counter",
          `engram_pruned_total ${stats.expiredPruned}`,
        ];
        return new Response(lines.join("\n"), {
          headers: { "Content-Type": "text/plain; version=0.0.4" },
        });
      }

      if (url.pathname === "/stats" && method === "GET") {
        return Response.json(await store.stats());
      }

      if (url.pathname === "/search" && method === "POST") {
        const body = await req.json();
        const parsed = SearchRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const results = await search.query(parsed.data);
        return Response.json({ results, count: results.length });
      }

      if (url.pathname === "/memories" && method === "POST") {
        const body = await req.json();
        const parsed = UpsertRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: parsed.error.flatten() }, { status: 400 });
        }

        const memories = await pipeline.ingest(parsed.data);
        return Response.json({ memories, count: memories.length }, { status: 201 });
      }

      if (url.pathname.startsWith("/memories/") && method === "DELETE") {
        const id = url.pathname.replace("/memories/", "");
        await store.delete(id);
        return new Response(null, { status: 204 });
      }

      if (url.pathname === "/prune" && method === "POST") {
        return Response.json({ pruned: await store.pruneExpired() });
      }

      return Response.json({ error: "Not found" }, { status: 404 });
    },
  });

  log.info(`API running at http://localhost:${config.API_PORT}`);
  return server;
}
