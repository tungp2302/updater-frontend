function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

type SignedUrlResponse = {
  signedURL?: string;
  signedUrl?: string;
};

export async function createSignedUpdaterUrl(): Promise<string> {
  const supabaseUrl = requiredEnv("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = requiredEnv("UPDATER_ZIP_BUCKET");
  const objectPath = requiredEnv("UPDATER_ZIP_OBJECT_PATH");
  const expiresInSeconds = Number(process.env.UPDATER_ZIP_SIGNED_URL_TTL_SECONDS || 300);

  const response = await fetch(`${supabaseUrl}/storage/v1/object/sign/${bucket}/${objectPath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      expiresIn: Number.isFinite(expiresInSeconds) ? Math.max(60, expiresInSeconds) : 300,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Failed to create signed updater URL");
  }

  const payload = text ? (JSON.parse(text) as SignedUrlResponse) : {};
  const signedPath = payload.signedURL || payload.signedUrl;

  if (!signedPath) {
    throw new Error("Supabase did not return a signed URL");
  }

  if (signedPath.startsWith("http://") || signedPath.startsWith("https://")) {
    return signedPath;
  }

  return `${supabaseUrl}${signedPath}`;
}