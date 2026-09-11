import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAsyncData } from './useAsyncData';

describe('useAsyncData', () => {
  it('settles loading and exposes the error instead of hanging forever when the fetcher rejects', async () => {
    const { result } = renderHook(() => useAsyncData('rejects', () => Promise.reject(new Error('network down'))));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('dedupes concurrent calls for the same key into a single fetcher invocation', async () => {
    const fetcher = vi.fn(() => Promise.resolve('shared-result'));

    const first = renderHook(() => useAsyncData('shared-key', fetcher));
    const second = renderHook(() => useAsyncData('shared-key', fetcher));

    await waitFor(() => expect(first.result.current.loading).toBe(false));
    await waitFor(() => expect(second.result.current.loading).toBe(false));

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(first.result.current.data).toBe('shared-result');
    expect(second.result.current.data).toBe('shared-result');
  });
});
