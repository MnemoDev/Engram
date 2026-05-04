import React from "react";
import {
  Github,
  ArrowUpRight,
  ArrowDown,
  Eye,
  Hash,
  GitMerge,
  Trash2,
  Search,
  Brain,
  Sparkles,
  Clock,
  Filter,
  Target,
  Clock4,
  Trash,
  Hand,
  Check,
  X,
  Activity,
  Database,
  Layers,
} from "lucide-react";

export default function EngramLanding() {
  const navAnchors = [
    { label: "RECALL", href: "#recall" },
    { label: "DOCTRINE", href: "#doctrine" },
    { label: "LOOP", href: "#loop" },
    { label: "DECISION", href: "#decision" },
    { label: "LAUNCH", href: "#launch" },
  ];

  const recallRows = [
    {
      cat: "warning",
      text: "Pool 7xKp · 8x volume/TVL spike → 31% TVL drop",
      score: "0.94",
      age: "14d",
    },
    {
      cat: "pattern",
      text: "Wash-trading signature: single venue divergence > 0.3%",
      score: "0.91",
      age: "41d",
    },
    {
      cat: "outcome",
      text: "Spike-then-dump on 7-day window confirmed in prior cycle",
      score: "0.87",
      age: "6d",
    },
  ];

  const consoleRecall = [
    {
      cat: "warning",
      text: "Pool 4nMx · drift accelerating on JTO volatility",
      score: "0.94",
      age: "2d",
    },
    {
      cat: "pattern",
      text: "Volume/TVL ratio above 6x precedes 20%+ retrace",
      score: "0.92",
      age: "27d",
    },
    {
      cat: "outcome",
      text: "Exited Pool 9aQr at +14% on similar signature",
      score: "0.89",
      age: "53d",
    },
    {
      cat: "warning",
      text: "Single-venue depth divergence on JTO/USDC last 4h",
      score: "0.86",
      age: "1d",
    },
    {
      cat: "context",
      text: "JTO funding flipped negative on derivatives venue",
      score: "0.81",
      age: "4h",
    },
  ];

  const categoryIndex = [
    { name: "pattern", ttl: "90d", count: 642 },
    { name: "warning", ttl: "60d", count: 391 },
    { name: "outcome", ttl: "180d", count: 514 },
    { name: "context", ttl: "30d", count: 300 },
  ];

  const eventLog = [
    { n: "01", k: "intake", t: "warning · \"Pool 4nMx · drift accelerating on JTO volatility\"" },
    { n: "02", k: "dedup", t: "cosine 0.94 with existing warning, merged." },
    { n: "03", k: "prune", t: "12 expired context entries removed (TTL 30d)." },
    { n: "04", k: "recall", t: "4 results returned in 38ms · top 0.94, blended with recency." },
    { n: "05", k: "hook", t: "before:ingest enriched 7 memories with auto-tag." },
    { n: "06", k: "ready", t: "No blocking events." },
  ];

  const doctrineCards = [
    {
      n: "01",
      icon: Sparkles,
      title: "The freshest match wins.",
      body: "Reranking blends similarity with recency. An old match has to fight an order of magnitude harder than a fresh one.",
    },
    {
      n: "02",
      icon: GitMerge,
      title: "Near-duplicates merge.",
      body: "Two memories with cosine similarity above 0.92 collapse into one. The store grows by signal, not by repetition.",
    },
    {
      n: "03",
      icon: Clock,
      title: "Memories expire on a clock.",
      body: "Each category carries a TTL. Patterns last 90 days, warnings 60, outcomes 180, context 30. The store stays clean.",
    },
    {
      n: "04",
      icon: Filter,
      title: "Context is what was just true.",
      body: "A useful memory still applies. Hooks let an operator shape what enters the store before it ever takes up space.",
    },
  ];

  const loopCards = [
    { n: "01", icon: Eye, title: "Observe", body: "Capture the moment as a typed observation: category, content, optional tags." },
    { n: "02", icon: Hash, title: "Embed", body: "Convert the observation into a vector. The vector lives in ChromaDB alongside its metadata." },
    { n: "03", icon: GitMerge, title: "Merge", body: "Check for near-duplicates. If a stored memory is more than 92% similar, merge instead of duplicate." },
    { n: "04", icon: Trash2, title: "Prune", body: "Walk the store on schedule. Anything past its category TTL gets removed without ceremony." },
    { n: "05", icon: Search, title: "Recall", body: "A query becomes a vector. Top-K nearest by similarity, blended with recency, returned reranked." },
    { n: "06", icon: Brain, title: "Decide", body: "The retrieved context goes into the next agent decision. The cycle starts again." },
  ];

  const readyToStore = [
    "Observation is novel (no near-duplicate)",
    "Below the 0.92 dedup threshold",
    "Category recognized and TTL applies",
    "Required fields present",
    "Hooks pass without rejection",
    "Vector embedding succeeds",
  ];

  const reasonsToReject = [
    "Cosine similarity above 0.92 with an existing memory (merged, not stored)",
    "Required field missing (rejected)",
    "Category not recognized (rejected)",
    "TTL has already expired before storage (rejected)",
    "Hook returned reject (silently dropped)",
    "Embedding service unavailable (queued and retried)",
  ];

  const principles = [
    {
      n: "01",
      icon: Target,
      title: "Memory is signal, not storage.",
      body: "A memory the agent never recalls is dead weight. Engram measures usefulness by query hits, not by record count.",
    },
    {
      n: "02",
      icon: Clock4,
      title: "Recency is its own truth.",
      body: "A 60-day-old warning beats a 60-second match if the warning was right. Reranking enforces that order.",
    },
    {
      n: "03",
      icon: Trash,
      title: "Forgetting is a feature.",
      body: "Old context that no longer applies pollutes the next decision. The TTL is the cleanup, not a limit.",
    },
    {
      n: "04",
      icon: Hand,
      title: "The agent earns its memory.",
      body: "Hooks let operators shape what enters the store. The agent reads what was deliberately put there, not noise.",
    },
  ];

  const chipClasses = (cat) => {
    switch (cat) {
      case "warning":
        return "bg-amber-200/10 text-amber-200/90 border-amber-200/20";
      case "pattern":
        return "bg-slate-300/10 text-slate-200/90 border-slate-300/20";
      case "outcome":
        return "bg-emerald-400/10 text-emerald-300 border-emerald-400/30";
      case "context":
        return "bg-teal-300/10 text-teal-200/90 border-teal-300/20";
      default:
        return "bg-white/5 text-white/70 border-white/10";
    }
  };

  return (
    <div className="scroll-smooth bg-[#050505] text-white antialiased selection:bg-emerald-400/30 selection:text-white">
      {/* ============== STICKY NAV ============== */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#050505]/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 lg:px-8">
          <a href="#top" className="font-semibold tracking-[0.18em] text-white text-[15px]">
            ENGRAM
          </a>
          <nav className="hidden md:flex items-center gap-7 text-[11px] font-medium tracking-[0.22em] text-white/60">
            {navAnchors.map((a) => (
              <a key={a.href} href={a.href} className="hover:text-white transition-colors">
                {a.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center rounded-md border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-white/70">
              CA:PENDING
            </span>
            <a
              href="https://github.com/MnemoDev/Engram"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-colors"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
            <a
              href="#launch"
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-black hover:bg-emerald-400 transition-colors"
            >
              Launch Engram
            </a>
          </div>
        </div>
      </header>

      {/* ============== HERO ============== */}
      <section id="top" className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-[1400px] grid-cols-1 items-center gap-12 px-5 py-16 lg:grid-cols-[55fr_45fr] lg:gap-14 lg:px-8 lg:py-20">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/[0.06] px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
                LIVE AGENT MEMORY
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-white/40"></span>
                VECTOR-INDEXED · TTL-PRUNED
              </span>
            </div>

            <h1 className="font-semibold tracking-[-0.03em] leading-[0.92] text-[44px] sm:text-6xl lg:text-7xl xl:text-8xl">
              <span className="block text-white">Stateless agents</span>
              <span className="block text-white/30">repeat their mistakes.</span>
            </h1>

            <p className="max-w-xl text-[15px] leading-relaxed text-white/60 lg:text-base">
              Engram is a persistent memory layer for AI agents. Store what they observe,
              recall what's relevant when they decide. Memories that prove their worth
              stay; the rest get pruned.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#recall"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold tracking-wide text-black hover:bg-emerald-400 transition-colors"
              >
                View the live recall
              </a>
              <a
                href="#loop"
                className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-5 py-3 text-sm font-medium tracking-wide text-white/85 hover:border-white/35 hover:text-white transition-colors"
              >
                Read the architecture <ArrowUpRight size={14} />
              </a>
            </div>
          </div>

          {/* Right column — Query → Recall panel */}
          <div className="rounded-xl border border-white/10 bg-[#0c0d0c] p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_-30px_rgba(16,185,129,0.15)]">
            {/* Header */}
            <div className="flex items-center justify-between font-mono text-[10.5px] tracking-[0.16em] text-white/45">
              <span>memory.recall/cycle/8492</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"></span>
                MATCHED · 38ms
              </span>
            </div>

            {/* Query callout */}
            <div className="mt-6">
              <div className="font-mono text-[10px] tracking-[0.22em] text-white/40">AGENT ASKED</div>
              <div className="mt-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/[0.05] p-6">
                <p className="font-mono text-[17px] leading-relaxed text-white sm:text-lg">
                  "Have we seen this volume/TVL pattern before?"
                </p>
              </div>
            </div>

            {/* Transition */}
            <div className="my-5 flex flex-col items-center gap-1.5">
              <ArrowDown size={18} className="text-emerald-400/70" />
              <span className="font-mono text-[10px] tracking-[0.22em] text-emerald-300/80">
                ENGRAM RECALLED
              </span>
            </div>

            {/* Recall list */}
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.015]">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] text-white/40">
                <span>3 MATCHES</span>
                <span>ranked by relevance + recency</span>
              </div>
              <ul className="divide-y divide-white/5">
                {recallRows.map((r, i) => (
                  <li key={i} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
                    <span
                      className={`inline-flex w-[68px] justify-center rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em] ${chipClasses(
                        r.cat
                      )}`}
                    >
                      {r.cat}
                    </span>
                    <span className="truncate font-mono text-[12px] text-white/85">{r.text}</span>
                    <span className="font-mono text-[11px] text-white/45 tabular-nums">
                      {r.score} · {r.age}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-white/5 pt-4 font-mono text-[10.5px] tracking-[0.12em] text-white/40">
              <span>search 38ms</span>
              <span>·</span>
              <span>1,847 memories indexed</span>
              <span>·</span>
              <span>0.92 dedup threshold</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== LIVE MEMORY CONSOLE ============== */}
      <section id="recall" className="border-t border-white/[0.06] bg-[#040404]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-8 lg:py-28">
          <div className="mb-10 flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] text-emerald-400">RECALL</span>
            <h2 className="font-semibold tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">Memory that decays</span>{" "}
              <span className="text-white/30">by design.</span>
            </h2>
          </div>

          {/* Console panel */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0b0a]">
            {/* Top status bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] bg-white/[0.015] px-5 py-3 font-mono text-[10.5px] tracking-[0.16em] text-white/55">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"></span>
                <span className="text-white/80">ENGRAM</span>
                <span className="text-white/30">·</span>
                <span>LIVE MEMORY</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span><span className="text-white/35">mode</span> <span className="text-emerald-300">LIVE</span></span>
                <span><span className="text-white/35">backend</span> CHROMADB</span>
                <span><span className="text-white/35">uptime</span> 41d 06h</span>
                <span><span className="text-white/35">last query</span> 38ms</span>
                <span><span className="text-white/35">indexed</span> 1,847</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px bg-white/[0.05] lg:grid-cols-[60fr_40fr]">
              {/* LEFT — Active recall */}
              <div className="bg-[#0a0b0a] p-6">
                <div className="mb-4 flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-white/45">
                  <span>ACTIVE RECALL</span>
                  <span>top-K = 5</span>
                </div>
                <div className="mb-5 rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <div className="font-mono text-[10px] tracking-[0.22em] text-white/45">CURRENT QUERY</div>
                  <div className="mt-2 font-mono text-[14px] text-white">
                    "Is Pool 4nMx behaving like the last drift cluster?"
                  </div>
                </div>
                <ul className="divide-y divide-white/5 rounded-lg border border-white/[0.07]">
                  {consoleRecall.map((r, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3"
                    >
                      <span
                        className={`inline-flex w-[68px] justify-center rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em] ${chipClasses(
                          r.cat
                        )}`}
                      >
                        {r.cat}
                      </span>
                      <span className="truncate font-mono text-[12px] text-white/85">{r.text}</span>
                      <span className="font-mono text-[11px] text-white/45 tabular-nums">
                        {r.score} · {r.age}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT column */}
              <div className="flex flex-col">
                {/* STORE HEALTH */}
                <div className="bg-[#0a0b0a] p-6">
                  <div className="mb-4 flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-white/45">
                    <span>STORE HEALTH</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-300/90">
                      <Activity size={11} /> nominal
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categoryIndex.map((c) => (
                      <div key={c.name} className="rounded-md border border-white/[0.07] bg-white/[0.015] p-3">
                        <div className="font-mono text-[10px] tracking-[0.2em] text-white/45">
                          {c.name}
                        </div>
                        <div className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white">
                          {c.count}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="rounded-md border border-white/[0.07] bg-white/[0.015] p-3">
                      <div className="text-[10px] tracking-[0.18em] text-white/40">DEDUP HITS</div>
                      <div className="mt-1 text-base text-white tabular-nums">28</div>
                    </div>
                    <div className="rounded-md border border-white/[0.07] bg-white/[0.015] p-3">
                      <div className="text-[10px] tracking-[0.18em] text-white/40">EXPIRED</div>
                      <div className="mt-1 text-base text-white tabular-nums">47</div>
                    </div>
                    <div className="rounded-md border border-white/[0.07] bg-white/[0.015] p-3">
                      <div className="text-[10px] tracking-[0.18em] text-white/40">TOTAL</div>
                      <div className="mt-1 text-base text-white tabular-nums">1,847</div>
                    </div>
                  </div>
                </div>

                {/* CATEGORY INDEX strip */}
                <div className="border-t border-white/[0.06] bg-[#0a0b0a] p-6">
                  <div className="mb-3 font-mono text-[10.5px] tracking-[0.2em] text-white/45">
                    CATEGORY INDEX
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {categoryIndex.map((c) => (
                      <div
                        key={c.name}
                        className={`rounded-md border px-3 py-2 font-mono text-[11px] ${chipClasses(c.name)}`}
                      >
                        <div className="tracking-[0.14em] opacity-90">{c.name}</div>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-[10px] opacity-70">TTL {c.ttl}</span>
                          <span className="text-sm tabular-nums">{c.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* EVENT LOG */}
            <div className="border-t border-white/[0.06] bg-[#070807] p-6">
              <div className="mb-3 flex items-center justify-between font-mono text-[10.5px] tracking-[0.2em] text-white/45">
                <span>EVENT LOG</span>
                <span>tail · last 6</span>
              </div>
              <ul className="divide-y divide-white/[0.04] rounded-lg border border-white/[0.06] bg-black/40 font-mono text-[12px]">
                {eventLog.map((e) => (
                  <li key={e.n} className="grid grid-cols-[auto_auto_1fr] items-center gap-3 px-4 py-2.5">
                    <span className="text-white/35 tabular-nums">{e.n}</span>
                    <span className="rounded bg-white/[0.04] px-2 py-0.5 text-[10px] tracking-[0.14em] text-emerald-300/90">
                      {e.k}
                    </span>
                    <span className="truncate text-white/80">{e.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Caption */}
          <p className="mt-8 text-center font-mono text-[12px] tracking-[0.08em] text-white/45">
            Live memory. Every observation, every prune cycle, every recall ranked. The store learns what to forget.
          </p>

          {/* 3-stat strip */}
          <div className="mt-10 border-y border-white/10 py-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { v: "0.92", l: "Dedup threshold" },
                { v: "85/15", l: "Cosine vs recency mix" },
                { v: "4", l: "Categories with TTL" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div className="font-semibold tracking-[-0.02em] text-4xl text-white sm:text-5xl tabular-nums">
                    {s.v}
                  </div>
                  <div className="mt-2 font-mono text-[11px] tracking-[0.2em] text-white/45">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== DOCTRINE ============== */}
      <section id="doctrine" className="border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-24 lg:grid-cols-[40fr_60fr] lg:gap-16 lg:px-8 lg:py-28">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="font-mono text-[11px] tracking-[0.3em] text-emerald-400">DOCTRINE</span>
            <h2 className="mt-4 font-semibold tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">Memory is signal,</span>{" "}
              <span className="text-white/30">not storage.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
              Four rules govern every memory in the store. They decide what stays, what merges,
              and what gets cleared so the next decision rides on what still matters.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {doctrineCards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.n}
                  className="group flex flex-col rounded-xl border border-white/10 bg-[#0a0b0a] p-7 transition-colors duration-200 hover:border-emerald-500/40"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.22em] text-emerald-400">
                        {c.n}
                      </div>
                      <div className="mt-2 h-px w-8 bg-emerald-400/60"></div>
                    </div>
                    <Icon size={20} className="text-emerald-400/70" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== LOOP ============== */}
      <section id="loop" className="border-t border-white/[0.06] bg-[#040404]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-8 lg:py-28">
          <div className="mb-12 flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] text-emerald-400">THE LOOP</span>
            <h2 className="font-semibold tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">Six steps.</span>{" "}
              <span className="text-white/30">Every observation.</span>
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/55">
              The same path on every memory. An observation that does not pass all six does not enter the store.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loopCards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.n}
                  className="group flex h-full flex-col rounded-xl border border-white/10 bg-[#0a0b0a] p-8 transition-colors duration-200 hover:border-emerald-500/40"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.22em] text-emerald-400">
                        {c.n}
                      </div>
                      <div className="mt-2 h-px w-8 bg-emerald-400/60"></div>
                    </div>
                    <Icon size={22} className="text-emerald-400/80" />
                  </div>
                  <h3 className="mt-7 text-xl font-semibold tracking-[-0.01em] text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== DECISION ============== */}
      <section id="decision" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-8 lg:py-28">
          <div className="mb-12 flex flex-col gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] text-emerald-400">DECISION</span>
            <h2 className="font-semibold tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">What enters the store.</span>{" "}
              <span className="text-white/30">And what gets refused.</span>
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/55">
              An observation either earns its slot or it does not. The store measures itself by usefulness, not by size.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Ready */}
            <div className="rounded-xl border border-white/10 bg-[#0a0b0a] p-7">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"></span>
                <span className="font-mono text-[11px] tracking-[0.22em] text-emerald-300">
                  READY TO STORE
                </span>
              </div>
              <ul className="mt-6 flex flex-col gap-3.5">
                {readyToStore.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-white/85">
                    <Check size={16} className="mt-1 shrink-0 text-emerald-400" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Reject */}
            <div className="rounded-xl border border-white/10 bg-[#0a0b0a] p-7">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.7)]"></span>
                <span className="font-mono text-[11px] tracking-[0.22em] text-amber-200/90">
                  REASONS TO MERGE OR REJECT
                </span>
              </div>
              <ul className="mt-6 flex flex-col gap-3.5">
                {reasonsToReject.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[14.5px] leading-relaxed text-white/85">
                    <X size={16} className="mt-1 shrink-0 text-slate-400" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PRINCIPLES ============== */}
      <section id="principles" className="border-t border-white/[0.06] bg-[#040404]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-24 lg:grid-cols-[40fr_60fr] lg:gap-16 lg:px-8 lg:py-28">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="font-mono text-[11px] tracking-[0.3em] text-emerald-400">PRINCIPLES</span>
            <h2 className="mt-4 font-semibold tracking-[-0.03em] leading-[0.95] text-4xl sm:text-5xl lg:text-6xl">
              <span className="text-white">Rules of recall.</span>{" "}
              <span className="text-white/30">Every query, every cycle.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
              The product is not the store. The product is what the agent decides next.
              These four rules keep the store on that side of the line.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {principles.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.n}
                  className="flex flex-col rounded-xl border border-white/10 bg-[#0a0b0a] p-7 transition-colors duration-200 hover:border-emerald-500/40"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-mono text-[11px] tracking-[0.22em] text-emerald-400">
                        {c.n}
                      </div>
                      <div className="mt-2 h-px w-8 bg-emerald-400/60"></div>
                    </div>
                    <Icon size={20} className="text-emerald-400/70" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em] text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-white/60">{c.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== LAUNCH ============== */}
      <section id="launch" className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-[1400px] px-5 py-24 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-6">
            <span className="font-mono text-[11px] tracking-[0.3em] text-emerald-400">LAUNCH</span>
            <h2 className="max-w-4xl font-semibold tracking-[-0.03em] leading-[0.98] text-4xl sm:text-5xl lg:text-6xl text-white">
              A token for an agent that learns what to forget.
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-white/60">
              Engram launches on Pump.fun as a fair launch. The contract address is pinned at the
              top of this page and fills the moment it drops.
            </p>
            <div className="pt-2">
              <a
                href="https://x.com/"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold tracking-wide text-black hover:bg-emerald-400 transition-colors"
              >
                Follow for the drop: X <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============== CLOSING CTA ============== */}
      <section className="border-t border-white/[0.06] bg-[#040404]">
        <div className="mx-auto max-w-[1100px] px-5 py-28 text-center lg:py-32">
          <h2 className="font-semibold tracking-[-0.03em] leading-[0.95] text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">Memory you can verify.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/60">
            A persistent recall layer that proves its worth on every query.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#launch"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold tracking-wide text-black hover:bg-emerald-400 transition-colors"
            >
              Launch Engram
            </a>
            <a
              href="https://github.com/MnemoDev/Engram"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 px-5 py-3 text-sm font-medium tracking-wide text-white/85 hover:border-white/35 hover:text-white transition-colors"
            >
              View on GitHub <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto max-w-[1400px] px-5 py-14 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/45">SITE</div>
              <ul className="mt-5 flex flex-col gap-3 text-[14px] text-white/75">
                <li><a href="#recall" className="hover:text-white transition-colors">Recall</a></li>
                <li><a href="#doctrine" className="hover:text-white transition-colors">Doctrine</a></li>
                <li><a href="#loop" className="hover:text-white transition-colors">Loop</a></li>
                <li><a href="#decision" className="hover:text-white transition-colors">Decision</a></li>
                <li><a href="#launch" className="hover:text-white transition-colors">Launch</a></li>
              </ul>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-white/45">PROJECT</div>
              <ul className="mt-5 flex flex-col gap-3 text-[14px] text-white/75">
                <li><a href="https://github.com/MnemoDev/Engram" className="hover:text-white transition-colors">Docs</a></li>
                <li><a href="#recall" className="hover:text-white transition-colors">Status</a></li>
                <li>
                  <a href="https://github.com/MnemoDev/Engram" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                    GitHub <ArrowUpRight size={12} />
                  </a>
                </li>
                <li>
                  <a href="https://x.com/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                    X <ArrowUpRight size={12} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/[0.08] pt-6 font-mono text-[11px] tracking-[0.18em] text-white/45 sm:flex-row sm:items-center">
            <span>Engram | MnemoDev | © 2026</span>
            <span>v1.0 · live</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
