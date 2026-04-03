import { config } from "./lib/config.js";
import { createLogger } from "./lib/logger.js";
import { ChromaStore } from "./store/chroma.js";
import { MemoryStore } from "./store/memory.js";
import type { StoreBackend } from "./store/base.js";
import { startServer } from "./api/server.js";

const log = createLogger("Engram");

async function main() {
  log.info("Engram starting", {
    backend: config.STORE_BACKEND,
    port: config.API_PORT,
    collection: config.COLLECTION_NAME,
  });

  const store: StoreBackend =
    config.STORE_BACKEND === "chroma" ? new ChromaStore() : new MemoryStore();

  await store.initialize();

  // Prune expired entries on startup
  const pruned = await store.pruneExpired();
  if (pruned > 0) log.info("Pruned on startup", { count: pruned });

  // Start API server
  startServer(store);

  // Scheduled pruning
  setInterval(
    async () => {
      const count = await store.pruneExpired();
      if (count > 0) log.info("Scheduled prune", { count });
    },
    config.PRUNE_INTERVAL_HOURS * 60 * 60 * 1000
  );

  log.info(`Ready — POST http://localhost:${config.API_PORT}/memories to store, POST /search to retrieve`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});

