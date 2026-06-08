/** User-facing auth messages — never expose raw Supabase/backend errors. */

export const AUTH_SIGN_IN_ERROR =
  "Could not sign in. Please check your email and password and try again.";

export const AUTH_SIGN_UP_ERROR =
  "Could not create your account. Please try again.";

export const AUTH_CONFIRM_ERROR =
  "Could not complete sign in. Please try again or request a new confirmation link.";

export const AUTH_SERVER_ERROR =
  "Please try again in a few hours — the site may be under maintenance.";

export type AuthErrorKind = "auth" | "server";

type AuthErrorLike = {
  message?: string;
  status?: number;
  name?: string;
};

const SERVER_ERROR_PATTERNS = [
  "timed out",
  "timeout",
  "network",
  "fetch failed",
  "failed to fetch",
  "could not reach",
  "econnrefused",
  "enotfound",
  "abort",
  "service unavailable",
  "internal server error",
  "bad gateway",
  "gateway timeout",
  "temporarily unavailable"
] as const;

export function isAuthServerError(error: unknown): boolean {
  if (error == null) return true;

  if (typeof error === "object" && "status" in error) {
    const status = (error as AuthErrorLike).status;
    if (typeof status === "number" && (status >= 500 || status === 0)) {
      return true;
    }
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as AuthErrorLike).message ?? "")
        : "";

  const normalized = message.toLowerCase();
  const name =
    error instanceof Error
      ? error.name
      : typeof error === "object" && error !== null && "name" in error
        ? String((error as AuthErrorLike).name ?? "")
        : "";

  if (name === "AbortError") return true;

  return SERVER_ERROR_PATTERNS.some((pattern) => normalized.includes(pattern));
}

export function getAuthErrorKind(error: unknown): AuthErrorKind {
  return isAuthServerError(error) ? "server" : "auth";
}

export function getSignInErrorMessage(errorKind?: string): string {
  if (errorKind === "server") return AUTH_SERVER_ERROR;
  if (errorKind === "auth") return AUTH_SIGN_IN_ERROR;
  return AUTH_SIGN_IN_ERROR;
}

export function getSignUpErrorMessage(errorKind?: string): string {
  if (errorKind === "server") return AUTH_SERVER_ERROR;
  if (errorKind === "auth") return AUTH_SIGN_UP_ERROR;
  return AUTH_SIGN_UP_ERROR;
}
