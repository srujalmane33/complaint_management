/**
 * Helper to resolve image URL for full display in browser
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("data:") || url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  
  // Resolve base API URL (e.g. http://localhost:3004)
  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3004/api";
  const baseUrl = apiBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};
