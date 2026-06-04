import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type FetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useApi<T>(url: string, options?: { redirectOnError?: boolean }): FetchResult<T> {
  const router = useRouter();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          if (options?.redirectOnError !== false && (d.error === "No autorizado" || d.status === 401)) {
            router.push("/login");
            return;
          }
          setError(d.error);
        } else {
          setData(d);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [url, router, options?.redirectOnError]);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}
