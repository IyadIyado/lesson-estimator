import type { DataProvider } from "./types";
import { mockProvider } from "./mock-provider";

let _provider: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (_provider) return _provider;

  if (process.env.USE_MOCK === "true") {
    _provider = mockProvider;
  } else {
    // Lazy import to avoid loading Supabase deps in mock mode
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { supabaseProvider } = require("./supabase-provider");
    _provider = supabaseProvider;
  }

  return _provider;
}
