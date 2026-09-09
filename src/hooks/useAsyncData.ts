import { useEffect, useState } from 'react';

/**
 * Refetches `fetcher` whenever `key` changes. Resetting `data`/`loading` happens
 * synchronously during render (comparing against the previous key) rather than in
 * the effect body, so the effect only ever calls setState from the async callback.
 */
export function useAsyncData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [prevKey, setPrevKey] = useState(key);

  if (key !== prevKey) {
    setPrevKey(key);
    setData(undefined);
    setLoading(true);
  }

  useEffect(() => {
    let active = true;
    fetcher().then((result) => {
      if (active) {
        setData(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading } as const;
}
