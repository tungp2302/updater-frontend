import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function createSignedUpdaterUrl(): Promise<string> {
  const supabaseUrl = requiredEnv("SUPABASE_URL");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = requiredEnv("UPDATER_ZIP_BUCKET");
  const objectPath = requiredEnv("UPDATER_ZIP_OBJECT_PATH");
  const expiresInSeconds = Number(process.env.UPDATER_ZIP_SIGNED_URL_TTL_SECONDS || 300);

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Failed to create signed updater URL");
  }

  return data.signedUrl;
}