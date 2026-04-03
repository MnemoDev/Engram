import { createLogger } from "../lib/logger.js";

const log = createLogger("Hooks");

type HookEvent = "before:ingest" | "after:ingest" | "before:search" | "after:search";
type HookFn<T> = (payload: T) => Promise<T> | T;

const registry = new Map<HookEvent, HookFn<unknown>[]>();

export function registerHook<T>(event: HookEvent, fn: HookFn<T>): void {
  const existing = registry.get(event) ?? [];
  registry.set(event, [...existing, fn as HookFn<unknown>]);
  log.debug("Hook registered", { event });
}

export async function applyHooks<T>(event: HookEvent, payload: T): Promise<T> {
  const hooks = registry.get(event) ?? [];
  let current = payload;
  for (const hook of hooks) {
    current = (await hook(current)) as T;
  }
  return current;
}

// ─── Built-in hooks ───────────────────────────────────────────────────────────

// Sanitize: strip null bytes and excessive whitespace before ingestion
registerHook("before:ingest", (req: unknown) => {
  if (typeof req === "object" && req !== null && "content" in req) {
    const r = req as { content: string };
    return {
      ...r,
      content: r.content.replace(/\0/g, "").replace(/\s{3,}/g, "  ").trim(),
    };
  }
  return req;
});
