// Thin fetch wrappers around our auth API routes, plus token storage helpers.
// Kept in one place so pages don't repeat fetch/error-handling logic.

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    // Backend always sends a human-readable `message`, so throw that.
    throw new Error(body.message || "Something went wrong");
  }

  return body;
}

export function registerRequest(input: { name: string; email: string; password: string }) {
  return apiRequest<{ user: { id: string; name: string; email: string } }>(
    "/api/auth/register",
    { method: "POST", body: JSON.stringify(input) }
  );
}

export function loginRequest(input: { email: string; password: string }) {
  return apiRequest<{
    token: string;
    user: { id: string; name: string; email: string; role: string };
  }>("/api/auth/login", { method: "POST", body: JSON.stringify(input) });
}

export function verifyEmailRequest(token: string) {
  return apiRequest<{ email: string }>(
    `/api/auth/verify-email?token=${encodeURIComponent(token)}`
  );
}

// --- Token storage ---
// NOTE: localStorage is used here because it's simple and fine for a
// student/portfolio project. For a real production app, prefer an
// HTTP-only cookie set by the server on login — localStorage is
// readable by any JS on the page, which makes it vulnerable to XSS.
const TOKEN_KEY = "nexmart_token";

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
