import fs from "fs";
import path from "path";

type Level = "debug" | "info" | "warn" | "error";
const C: Record<Level, string> = { debug: "\x1b[90m", info: "\x1b[36m", warn: "\x1b[33m", error: "\x1b[31m" };
const R = "\x1b[0m";

let stream: fs.WriteStream | null = null;
function getStream() {
  if (!stream) {
    fs.mkdirSync(path.resolve("logs"), { recursive: true });
    stream = fs.createWriteStream(path.resolve("logs/engram.jsonl"), { flags: "a" });
  }
  return stream;
}

function emit(level: Level, ns: string, msg: string, data?: unknown) {
  const entry = { ts: new Date().toISOString(), level, ns, msg, ...(data !== undefined ? { data } : {}) };
  const line = `${entry.ts} ${C[level]}[${level.toUpperCase().padEnd(5)}]${R} \x1b[35m[${ns}]${R} ${msg}`;
  if (level === "error") console.error(line, data ?? "");
  else if (level === "warn") console.warn(line, data ?? "");
  else console.log(line, data ?? "");
  getStream().write(JSON.stringify(entry) + "\n");
}

export function createLogger(ns: string) {
  return {
    debug: (msg: string, data?: unknown) => emit("debug", ns, msg, data),
    info:  (msg: string, data?: unknown) => emit("info",  ns, msg, data),
    warn:  (msg: string, data?: unknown) => emit("warn",  ns, msg, data),
    error: (msg: string, data?: unknown) => emit("error", ns, msg, data),
  };
}
