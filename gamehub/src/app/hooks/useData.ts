/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosRequestConfig, CanceledError } from "axios";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

const useData = <T>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    apiClient
      .get<T[] | { results: T[] }>(endpoint, {
        signal: controller.signal,
        ...requestConfig,
      })
      .then((res) => {
        const payload = res.data;
        if (Array.isArray(payload)) {
          setData(payload); // raw array
        } else if ("results" in payload && Array.isArray(payload.results)) {
          setData(payload.results); // wrapped format
        } else {
          console.warn("Unexpected response format:", payload);
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, deps);

  return { data, error, isLoading };
};

export default useData;
