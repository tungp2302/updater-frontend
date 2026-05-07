export const LICENSE_MAX_DEVICES = 4;

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getOriginFromRequest(request: Request): string | null {
  const origin = request.headers.get("origin");

  if (origin) {
    return origin;
  }

  const referer = request.headers.get("referer");

  if (!referer) {
    return null;
  }

  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function getServerEnv() {
  return {
    appUrl: process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim() || "",
    stripeSecretKey: requiredEnv("STRIPE_SECRET_KEY"),
    stripeWebhookSecret: requiredEnv("STRIPE_WEBHOOK_SECRET"),
    stripePriceId: requiredEnv("STRIPE_PRICE_ID"),
    supabaseUrl: requiredEnv("SUPABASE_URL"),
    supabaseServiceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getStripeCheckoutEnv() {
  return {
    stripePriceId: requiredEnv("STRIPE_PRICE_ID"),
    stripeSecretKey: requiredEnv("STRIPE_SECRET_KEY"),
  };
}

export function getStripeWebhookEnv() {
  return {
    stripeWebhookSecret: requiredEnv("STRIPE_WEBHOOK_SECRET"),
  };
}

export function getSupabaseEnv() {
  return {
    supabaseServiceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    supabaseUrl: requiredEnv("SUPABASE_URL"),
  };
}

export function getAppBaseUrl(request: Request): string {
  const configuredUrl = process.env.APP_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const requestOrigin = getOriginFromRequest(request);

  if (requestOrigin) {
    return requestOrigin.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}
