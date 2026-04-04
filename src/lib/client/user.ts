const USER_KEY = "snaplet_user_id";

export function getClientUserId(): string {
  if (typeof window === "undefined") {
    return "server_render_user";
  }

  const existing = window.localStorage.getItem(USER_KEY);
  if (existing) {
    return existing;
  }

  const next = `usr_${crypto.randomUUID()}`;
  window.localStorage.setItem(USER_KEY, next);
  return next;
}
