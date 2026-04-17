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

  if (config.PRUNE_ON_STARTUP) {
    const pruned = await store.pruneExpired();
    if (pruned > 0) {
      log.info("Pruned on startup", { count: pruned });
    }
  }

  const server = startServer(store);
  const stopPruneLoop = startPruneLoop(store);
  const cleanupSignalHandlers = registerShutdownHandlers(() => {
    log.warn("Shutdown requested. Stopping API server and prune loop.");
    stopPruneLoop();
    server.stop();
  });

  log.info(
    `Ready - POST http://localhost:${config.API_PORT}/memories to store, POST /search to retrieve`
  );

  return () => {
    cleanupSignalHandlers();
    stopPruneLoop();
    server.stop();
  };
}

function startPruneLoop(store: StoreBackend): () => void {
  const intervalMs = config.PRUNE_INTERVAL_HOURS * 60 * 60 * 1000;
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pruneInFlight = false;

  const scheduleNext = () => {
    if (stopped) {
      return;
    }

    timer = setTimeout(async () => {
      if (pruneInFlight) {
        log.warn("Skipping scheduled prune because a previous prune is still running");
        scheduleNext();
        return;
      }

      pruneInFlight = true;
      const startedAt = Date.now();

      try {
        const count = await store.pruneExpired();
        if (count > 0) {
          log.info("Scheduled prune", { count, durationMs: Date.now() - startedAt });
        }
      } catch (err) {
        log.error("Scheduled prune failed", {
          error: err instanceof Error ? err.message : String(err),
        });
      } finally {
        pruneInFlight = false;
        scheduleNext();
      }
    }, intervalMs);
  };

  scheduleNext();

  return () => {
    stopped = true;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

function registerShutdownHandlers(onShutdown: () => void): () => void {
  const handleSignal = (signal: NodeJS.Signals) => {
    log.warn("Shutdown signal received", { signal });
    onShutdown();
  };

  process.once("SIGINT", handleSignal);
  process.once("SIGTERM", handleSignal);

  return () => {
    process.off("SIGINT", handleSignal);
    process.off("SIGTERM", handleSignal);
  };
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
