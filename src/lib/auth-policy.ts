// Domain Authentication Policy
// ============================

export const ALLOWED_UNIVERSITY_DOMAIN = "brainwareuniversity.ac.in";

/*
// Optional env-configured test emails (comma separated in VITE_ALLOWED_TEST_EMAILS in .env)
const envTestEmails = (import.meta.env.VITE_ALLOWED_TEST_EMAILS || "")
  .split(",")
  .map((e: string) => e.toLowerCase().trim())
  .filter(Boolean);
*/

/**
 * Checks if a given email is permitted for NEW user registration.
 * - Allowed if it ends with @brainwareuniversity.ac.in
 */
export const isEmailAllowedForRegistration = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return normalized.endsWith(`@${ALLOWED_UNIVERSITY_DOMAIN}`);
};
