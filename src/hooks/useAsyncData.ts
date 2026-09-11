import { useEffect, useState } from 'react';

// Dedupes concurrent calls for the same key across component instances into a single fetcher
// invocation (e.g. CategoryNav, Footer, and CategoryShowcase all requesting top-level categories
// on the same page load) -- cleared on rejection so a failed fetch doesn't get stuck cached.
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Refetches `fetcher` whenever `key` changes. Resetting `data`/`loading`/`error` happens
 * synchronously during render (comparing against the previous key) rather than in
 * the effect body, so the effect only ever calls setState from the async callback.
 */
export function useAsyncData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [prevKey, setPrevKey] = useState(key);

  if (key !== prevKey) {
    setPrevKey(key);
    setData(undefined);
    setLoading(true);
    setError(undefined);
  }

  useEffect(() => {
    let active = true;
    let promise = inFlight.get(key) as Promise<T> | undefined;
    if (!promise) {
      promise = fetcher();
      inFlight.set(key, promise);
      promise.catch(() => inFlight.delete(key));
    }
    promise.then(
      (result) => {
        if (active) {
          setData(result);
          setLoading(false);
        }
      },
      (err: unknown) => {
        if (active) {
          setError(err);
          setLoading(false);
        }
      },
    );
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, error } as const;
}
