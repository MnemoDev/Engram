import { z } from "zod";
import "dotenv/config";

const ConfigSchema = z.object({
  CHROMA_URL: z.string().url().default("http://localhost:8000"),
  COLLECTION_NAME: z.string().default("engram"),
  API_PORT: z.coerce.number().default(4000),
  PRUNE_INTERVAL_HOURS: z.coerce.number().min(1).default(24),
  STORE_BACKEND: z.enum(["chroma", "memory"]).default("chroma"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Config = z.infer<typeof ConfigSchema>;

function loadConfig(): Config {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Configuration error:");
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
  return result.data;
}

export const config = loadConfig();

