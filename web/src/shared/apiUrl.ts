import getConfig from 'next/config';

/**
 * Returns the base URL used to reach the API.
 *
 * WHY THIS EXISTS
 * ---------------
 * For a normal (server) Next.js build we can rely on `publicRuntimeConfig`,
 * which is injected at request time by the Next.js runtime. There, `apiUrl` is
 * `/api` and Next.js `rewrites()` proxy `/api/*` -> API_URL.
 *
 * For a Tauri build we use `output: 'export'` (a fully static HTML export).
 * A static export has NO Next.js runtime, so `getConfig().publicRuntimeConfig`
 * is empty and `apiUrl` would be `undefined` in `out/index.html`. The only way
 * to get a value baked into the static bundle is a `NEXT_PUBLIC_*` env variable,
 * which Next.js inlines at build time.
 *
 * Resolution order:
 *   1. process.env.NEXT_PUBLIC_API_URL  (inlined at build time — works in static export)
 *   2. publicRuntimeConfig.apiUrl       (server build runtime value)
 *   3. '/api'                           (relative fallback for the server build)
 */
export function getApiUrl(): string {
  const fromPublicEnv = process.env.NEXT_PUBLIC_API_URL;
  if (fromPublicEnv) {
    return stripTrailingSlash(fromPublicEnv);
  }

  try {
    const config = getConfig();
    const runtimeApiUrl = config?.publicRuntimeConfig?.apiUrl;
    if (runtimeApiUrl) {
      return stripTrailingSlash(runtimeApiUrl);
    }
  } catch {
    // getConfig() can throw when there is no Next.js runtime (static export).
  }

  return '/api';
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}
