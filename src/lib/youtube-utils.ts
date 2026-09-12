/**
 * Extracts the 11-character YouTube video ID from various YouTube URL formats.
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://music.youtube.com/watch?v=VIDEO_ID
 */
export const extractYouTubeVideoId = (url?: string | null): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Returns a privacy-enhanced embedded YouTube URL (youtube-nocookie.com).
 * Returns null if the URL is invalid.
 */
export const getYouTubeEmbedUrl = (url?: string | null): string | null => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=0`;
};

/**
 * Validates if a string is a valid YouTube video URL.
 */
export const isValidYouTubeUrl = (url?: string | null): boolean => {
  if (!url || !url.trim()) return true; // Optional field
  return extractYouTubeVideoId(url) !== null;
};
