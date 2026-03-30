import type { DataProvider } from "./types";
import { mockProvider } from "./mock-provider";

let _provider: DataProvider | null = null;

export function getDataProvider(): DataProvider {
  if (_provider) return _provider;

  let provider: DataProvider;

  if (process.env.USE_MOCK === "true") {
    provider = mockProvider;
  } else {
    // Lazy import to avoid loading Supabase deps in mock mode
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { supabaseProvider } = require("./supabase-provider");
    provider = supabaseProvider;
  }

  _provider = provider;
  return _provider;
}
