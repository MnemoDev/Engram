/**
 * Basic usage example — store and retrieve memories via the HTTP API.
 * Run: bun run examples/basic.ts (requires Engram running on :4000)
 */

const BASE = "http://localhost:4000";

// 1. Store a warning memory
const stored = await fetch(`${BASE}/memories`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    category: "warning",
    content: "Pool 7xKp...3mN showed 8x volume/TVL spike before a 31% TVL drop. Likely wash trading.",
    poolAddress: "7xKp3mN...",
    tags: ["wash-trading", "volume-spike"],
  }),
});
console.log("Stored:", await stored.json());

// 2. Retrieve relevant memories
const results = await fetch(`${BASE}/search`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "unusual volume before TVL drop",
    topK: 3,
  }),
});
const { results: memories } = await results.json() as { results: Array<{ score: number; memory: { content: string } }> };
console.log("\nRetrieved memories:");
for (const r of memories) {
  console.log(`  [${r.score.toFixed(3)}] ${r.memory.content.slice(0, 80)}...`);
}

// 3. Check store stats
const stats = await fetch(`${BASE}/stats`);
console.log("\nStats:", await stats.json());

export {};
