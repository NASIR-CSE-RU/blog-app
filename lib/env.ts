const DEFAULT_API_BASE_URL = "https://api.geekfolks.com/api";

export function getApiBaseUrl() {
  return process.env.BLOG_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}
