/**
 * Validates and returns the Supabase connection environment variables.
 *
 * A helpful error is thrown when the variables are absent or hold an
 * obviously incomplete value (e.g. the placeholder `https://` that is
 * sometimes copy-pasted from documentation).
 *
 * Call this helper from every Supabase client factory so that
 * misconfiguration is surfaced immediately with a clear message rather
 * than a cryptic network error deep inside the request lifecycle.
 */

function assertValidUrl(value: string | undefined, name: string): string {
    if (!value || value.trim() === "") {
        throw new Error(
            `Missing environment variable "${name}".\n` +
            `Add it to your .env.local file (or Vercel project settings).\n` +
            `It should look like: ${name}=https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
        );
    }

    // Detect the common mistake of copying just "https://" without the project reference
    if (value.trim() === "https://") {
        throw new Error(
            `Environment variable "${name}" is incomplete — it is set to "https://" ` +
            `but is missing the Supabase project reference.\n` +
            `Correct format: ${name}=https://xxxxxxxxxxxxxxxxxxxx.supabase.co\n` +
            `Find your project URL in: Supabase Dashboard → Project Settings → API`
        );
    }

    // Must start with https:// (Supabase always uses TLS in production)
    // Allow http:// for local development (127.0.0.1 or localhost)
    const isLocal = value.includes("127.0.0.1") || value.includes("localhost");
    const isProd = process.env.NODE_ENV === 'production';
    
    if (!value.startsWith("https://") && (!isLocal || isProd)) {
        throw new Error(
            `Environment variable "${name}" must start with "https://".\n` +
            `Current value starts with: "${value.slice(0, 20)}…"\n` +
            `Correct format: ${name}=https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
        );
    }

    return value;
}

function assertNonEmpty(value: string | undefined, name: string): string {
    if (!value || value.trim() === "") {
        throw new Error(
            `Missing environment variable "${name}".\n` +
            `Add it to your .env.local file (or Vercel project settings).\n` +
            `Find your anon key in: Supabase Dashboard → Project Settings → API`
        );
    }
    return value;
}

// Cache the validated result so validation only runs once per process
let _config: { url: string; anonKey: string } | null = null;

export function getSupabaseConfig(): { url: string; anonKey: string } {
    if (_config) return _config;

    const url = assertValidUrl(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        "NEXT_PUBLIC_SUPABASE_URL"
    );
    const anonKey = assertNonEmpty(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );

    _config = { url, anonKey };
    return _config;
}
