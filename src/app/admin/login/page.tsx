import Image from "next/image";
import { redirect } from "next/navigation";
import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

/** Only ever send a signed-in admin back into the dashboard. */
function safeCallbackUrl(value: unknown) {
  return typeof value === "string" && /^\/admin(?:[/?#]|$)/.test(value) ? value : "/admin";
}

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const code = error instanceof CredentialsSignin && error.code === "rate_limited" ? "locked" : "1";
      redirect(`/admin/login?error=${code}&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
    throw error;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const error = params.error === "locked" ? "locked" : params.error === "1" ? "invalid" : null;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0b0b0a] px-5">
      <div className="w-full max-w-sm">
        <Image
          src="/images/hideaway-logo-light.svg"
          alt="Executive Hideaway Spa and Resort"
          width={509}
          height={591}
          priority
          className="mx-auto h-auto w-32"
        />

        <h1 className="mt-6 text-center text-2xl font-light tracking-[-0.03em] text-white">
          Admin sign in
        </h1>

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-(--accent)"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-(--accent)"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error === "locked"
                ? "Too many failed attempts. Wait 15 minutes, then try again."
                : "Incorrect email or password."}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-(--accent) px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
