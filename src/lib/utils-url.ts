/**
 * Ensures a URL has a safe http:// or https:// protocol prefix.
 * Sanitizes against javascript:, data:, vbscript:, or other malicious URI schemes.
 */
export const ensureUrl = (url: string | null | undefined): string => {
  if (!url) return "#";
  const trimmed = url.trim();
  if (
    /^javascript:/i.test(trimmed) ||
    /^data:/i.test(trimmed) ||
    /^vbscript:/i.test(trimmed)
  ) {
    return "#";
  }
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
