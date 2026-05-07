import { getSupabaseEnv } from "./env";

type SupabaseRequestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  method?: string;
  searchParams?: URLSearchParams;
};

function createSupabaseUrl(path: string, searchParams?: URLSearchParams): string {
  const env = getSupabaseEnv();
  const url = new URL(`${env.supabaseUrl.replace(/\/+$/, "")}/rest/v1/${path}`);

  if (searchParams) {
    searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
  }

  return url.toString();
}

async function supabaseRequest<T>(path: string, options: SupabaseRequestOptions = {}): Promise<T> {
  const env = getSupabaseEnv();
  const response = await fetch(createSupabaseUrl(path, options.searchParams), {
    method: options.method ?? "GET",
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      responseText || `Supabase request failed with status ${response.status} for ${path}`,
    );
  }

  return responseText ? (JSON.parse(responseText) as T) : (undefined as T);
}

export function supabaseSelect<T>(table: string, searchParams?: URLSearchParams): Promise<T> {
  return supabaseRequest<T>(table, { method: "GET", searchParams });
}

export function supabaseInsert<T>(table: string, body: unknown): Promise<T> {
  return supabaseRequest<T>(table, {
    method: "POST",
    body,
    headers: {
      Prefer: "return=representation",
    },
  });
}

export function supabaseUpsert<T>(table: string, body: unknown, onConflict: string): Promise<T> {
  return supabaseRequest<T>(table, {
    method: "POST",
    body,
    searchParams: new URLSearchParams({ on_conflict: onConflict }),
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
  });
}

export function supabaseUpdate<T>(table: string, body: unknown, searchParams: URLSearchParams): Promise<T> {
  return supabaseRequest<T>(table, {
    method: "PATCH",
    body,
    searchParams,
    headers: {
      Prefer: "return=representation",
    },
  });
}

export function supabaseRpc<T>(fn: string, body: unknown): Promise<T> {
  return supabaseRequest<T>(`rpc/${fn}`, {
    method: "POST",
    body,
    headers: {
      Prefer: "return=representation",
    },
  });
}
