/**
 * Ensures a URL has a protocol prefix (https://).
 * This prevents browsers from treating URLs like "github.com/user"
 * as relative paths (e.g. localhost:8080/github.com/user).
 */
export const ensureUrl = (url: string): string =>
  url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;
