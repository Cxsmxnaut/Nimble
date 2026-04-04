import { supabase } from "@/lib/client/supabase";

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers ?? {});

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    headers.set("authorization", `Bearer ${session.access_token}`);
    headers.set("x-snaplet-user-id", session.user.id);
  }

  if (!(init?.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(path, {
    ...init,
    headers,
  });

  const data = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed with ${response.status}`);
  }

  return data;
}
