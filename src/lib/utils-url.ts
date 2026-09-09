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

/**
 * Validates whether a given string is a valid GitHub URL.
 * Accepts: github.com/username, https://github.com/username, www.github.com/username, etc.
 */
export const isValidGithubUrl = (url: string | null | undefined): boolean => {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_\-.\/]+)?\/?(\?.*)?$/i;
  return githubRegex.test(trimmed);
};

/**
 * Validates whether a given string is a valid LinkedIn URL.
 * Accepts: linkedin.com/in/username, https://www.linkedin.com/in/username, in.linkedin.com/in/username, etc.
 */
export const isValidLinkedinUrl = (url: string | null | undefined): boolean => {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  const linkedinRegex = /^(https?:\/\/)?([a-z0-9-]+\.)*linkedin\.com\/[a-zA-Z0-9_\-\/]+(\?.*)?$/i;
  return linkedinRegex.test(trimmed);
};

/**
 * Normalizes valid social URLs by adding https:// if missing.
 */
export const normalizeSocialUrl = (url: string | null | undefined): string => {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};
