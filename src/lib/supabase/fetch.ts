const DEFAULT_SUPABASE_FETCH_TIMEOUT_MS = 6000;

export function createSupabaseFetch(timeoutMs = DEFAULT_SUPABASE_FETCH_TIMEOUT_MS) {
  return async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(input, {
        ...init,
        signal: init?.signal ?? controller.signal
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Supabase request timed out. Check your network or Supabase project status.");
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  };
}
