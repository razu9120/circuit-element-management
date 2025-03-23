type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  method: HttpMethod;
  path: string;
  queryParams?: Record<string, string>;
  body?: unknown;
  headers?: Record<string, string>;
  retryCount?: number;
  retryInterval?: number;
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_INTERVAL = 1000; // 1秒

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

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
  const url = new URL(`${API_BASE_URL}${path}`);
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
    const response = await fetch(url, {
      method: config.method,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });

    if (!response.ok) {
      throw createApiError(
        `API request failed: ${response.statusText}`,
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

export const apiClient = {
  async request<T>({
    method,
    path,
    queryParams,
    body,
    headers,
    retryCount = DEFAULT_RETRY_COUNT,
    retryInterval = DEFAULT_RETRY_INTERVAL,
  }: RequestConfig): Promise<T> {
    try {
      const url = buildUrl(path, queryParams);
      const response = await fetchWithRetry(
        url,
        { method, path, queryParams, body, headers },
        retryCount,
        retryInterval
      );
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw createApiError(
          `API request failed: ${error.message}`,
          (error as ApiError).status,
          (error as ApiError).statusText
        );
      }
      throw createApiError("An unexpected error occurred");
    }
  },

  // httpメソッド
  get: <T>(path: string, queryParams?: Record<string, string>) =>
    apiClient.request<T>({ method: "GET", path, queryParams }),

  post: <T>(path: string, body: unknown) =>
    apiClient.request<T>({ method: "POST", path, body }),

  put: <T>(path: string, body: unknown) =>
    apiClient.request<T>({ method: "PUT", path, body }),

  patch: <T>(path: string, body: unknown) =>
    apiClient.request<T>({ method: "PATCH", path, body }),

  delete: <T>(path: string, queryParams?: Record<string, string>) =>
    apiClient.request<T>({ method: "DELETE", path, queryParams }),
};
