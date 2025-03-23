type HttpMethod = "GET";

type CacheStrategy = "no-store" | "force-cache" | "reload";

interface RequestConfig {
  method: HttpMethod;
  path: string;
  queryParams?: Record<string, string>;
  headers?: Record<string, string>;
  retryCount?: number;
  retryInterval?: number;
  cache?: CacheStrategy;
  revalidate?: number;
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

interface NextRequestInit extends RequestInit {
  next?: {
    revalidate?: number;
  };
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_INTERVAL = 1000; // 1秒
const DEFAULT_CACHE_STRATEGY: CacheStrategy = "no-store";
const DEFAULT_REVALIDATE = 0;

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL || "http://localhost:3000/backend";

const createApiError = (
  message: string,
  status?: number,
  statusText?: string
): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.statusText = statusText;
  return error;
};

const buildUrl = (
  path: string,
  queryParams?: Record<string, string>
): string => {
  const url = new URL(`${BACKEND_API_BASE_URL}${path}`);
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (
  url: string,
  config: RequestConfig,
  retryCount: number,
  retryInterval: number
): Promise<Response> => {
  try {
    const requestConfig: NextRequestInit = {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      cache: config.cache || DEFAULT_CACHE_STRATEGY,
      next: { revalidate: config.revalidate || DEFAULT_REVALIDATE },
    };

    const response = await fetch(url, requestConfig);

    if (!response.ok) {
      throw createApiError(
        `Backend API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return response;
  } catch (error) {
    if (retryCount > 0) {
      await sleep(retryInterval);
      return fetchWithRetry(url, config, retryCount - 1, retryInterval);
    }
    throw error;
  }
};

export const serverApiClient = {
  async request<T>({
    method,
    path,
    queryParams,
    headers,
    retryCount = DEFAULT_RETRY_COUNT,
    retryInterval = DEFAULT_RETRY_INTERVAL,
    cache = DEFAULT_CACHE_STRATEGY,
    revalidate = DEFAULT_REVALIDATE,
  }: RequestConfig): Promise<T> {
    try {
      const url = buildUrl(path, queryParams);
      const response = await fetchWithRetry(
        url,
        { method, path, queryParams, headers, cache, revalidate },
        retryCount,
        retryInterval
      );
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw createApiError(
          `Backend API request failed: ${error.message}`,
          (error as ApiError).status,
          (error as ApiError).statusText
        );
      }
      throw createApiError("An unexpected error occurred");
    }
  },

  // SSR用のメソッド（キャッシュなし）
  getSSR: <T>(path: string, queryParams?: Record<string, string>) =>
    serverApiClient.request<T>({
      method: "GET",
      path,
      queryParams,
      cache: "no-store",
      revalidate: 0,
    }),

  // SSG用のメソッド（キャッシュあり）
  getSSG: <T>(path: string, queryParams?: Record<string, string>) =>
    serverApiClient.request<T>({
      method: "GET",
      path,
      queryParams,
      cache: "force-cache",
      revalidate: 0,
    }),

  // ISR用のメソッド（再検証あり）
  getISR: <T>(
    path: string,
    revalidateSeconds: number,
    queryParams?: Record<string, string>
  ) =>
    serverApiClient.request<T>({
      method: "GET",
      path,
      queryParams,
      cache: "force-cache",
      revalidate: revalidateSeconds,
    }),

  // 通常のメソッド（デフォルトはSSR）
  get: <T>(path: string, queryParams?: Record<string, string>) =>
    serverApiClient.getSSR<T>(path, queryParams),
};
