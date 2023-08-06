import { Key, SWRConfiguration } from 'swr';
import useSWRImmutable from 'swr/immutable';
import useSWR from 'swr';

export async function fetcher<T>(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  return (await res.json()) as T;
}

export function useDataFetch<Data, Error = any>(
  key: Key,
  config?: SWRConfiguration
) {
  // Using SWRImmutable here to avoid refetch on stale/focus/reconnect
  // https://swr.vercel.app/docs/revalidation#disable-automatic-revalidations
  return useSWRImmutable<Data, Error>(key, fetcher, config);
}

export function useDataFetchWithAutomaticRefresh<Data, Error = any>(
  key: Key,
  config?: SWRConfiguration
) {
  return useSWR<Data, Error>(key, fetcher, config);
}
