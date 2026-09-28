import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/admin");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/admin/login?error=1&callbackUrl=${encodeURIComponent(callbackUrl)}`);
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
  const hasError = params.error === "1";
  const callbackUrl = params.callbackUrl ?? "/admin";

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0b0b0a] px-5">
      <div className="w-full max-w-sm">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-(--accent)">
          Executive Hideaway
        </p>

        <h1 className="mt-3 text-center text-2xl font-light tracking-[-0.03em] text-white">
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

          {hasError && (
            <p className="text-sm text-red-400">Incorrect email or password.</p>
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
