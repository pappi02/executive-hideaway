import { AdminForm } from "@/components/admin/AdminForm";
import { MIN_PASSWORD_LENGTH } from "@/lib/admin-session";
import { formatNairobi } from "@/lib/poster-time";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { decryptTotpSecret, totpSetupUri } from "@/lib/totp";
import { changePassword, confirmTwoFactorSetup, startTwoFactorSetup, turnOffTwoFactor } from "./actions";

const inputClass = "mt-1.5 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-(--accent)";
const labelClass = "block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/55";
const buttonClass = "rounded-full bg-(--accent) px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0b0b0a] hover:bg-(--accent-light)";

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  const [admin, activity] = await Promise.all([
    prisma.admin.findUniqueOrThrow({ where: { id: session.id }, select: { email: true, totpSecret: true, totpEnabledAt: true } }),
    prisma.adminActivity.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const pendingSecret = admin.totpSecret && !admin.totpEnabledAt ? decryptTotpSecret(admin.totpSecret) : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-light tracking-[-0.03em]">Account</h1>
      <p className="mt-2 text-sm text-black/50">{admin.email}</p>

      <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-medium">Two-factor sign-in</h2>
        {admin.totpEnabledAt ? (
          <>
            <p className="mt-2 text-sm text-black/60">On since {formatNairobi(admin.totpEnabledAt)}. Sign-in asks for a code from your authenticator app.</p>
            <AdminForm action={turnOffTwoFactor} successMessage="Two-factor sign-in turned off." className="mt-4 flex flex-wrap items-end gap-3">
              <div className="min-w-56 flex-1">
                <label htmlFor="off-password" className={labelClass}>Your password</label>
                <input id="off-password" name="password" type="password" required autoComplete="current-password" className={inputClass} />
              </div>
              <button type="submit" className="text-[10px] font-semibold uppercase tracking-[0.12em] text-red-600/80 hover:text-red-600">Turn off</button>
            </AdminForm>
          </>
        ) : pendingSecret ? (
          <>
            <p className="mt-2 text-sm text-black/60">Add this setup key to an authenticator app (Google Authenticator, Authy or similar), then enter the code it shows.</p>
            <p className="mt-3 break-all rounded-lg bg-black/5 px-3 py-2 font-mono text-sm">{pendingSecret}</p>
            <p className="mt-2 text-xs text-black/50">
              On your phone? <a href={totpSetupUri(pendingSecret, admin.email)} className="underline">Open it in your authenticator app</a>.
            </p>
            <AdminForm action={confirmTwoFactorSetup} successMessage="Two-factor sign-in is on." className="mt-4 flex flex-wrap items-end gap-3">
              <div>
                <label htmlFor="setup-code" className={labelClass}>Six-digit code</label>
                <input id="setup-code" name="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required autoComplete="one-time-code" className={inputClass} />
              </div>
              <button type="submit" className={buttonClass}>Turn on</button>
            </AdminForm>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-black/60">Off. Turning it on means a stolen password alone can&apos;t open the dashboard.</p>
            <AdminForm action={startTwoFactorSetup} successMessage="Setup key ready." className="mt-4">
              <button type="submit" className={buttonClass}>Set up</button>
            </AdminForm>
          </>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-medium">Change password</h2>
        <p className="mt-2 text-sm text-black/60">Signs you out everywhere. Use at least {MIN_PASSWORD_LENGTH} characters.</p>
        <AdminForm action={changePassword} successMessage="Password changed. Please sign in again." redirectTo="/admin/login" className="mt-4 grid gap-3">
          <div>
            <label htmlFor="current" className={labelClass}>Current password</label>
            <input id="current" name="current" type="password" required autoComplete="current-password" className={inputClass} />
          </div>
          <div>
            <label htmlFor="next" className={labelClass}>New password</label>
            <input id="next" name="next" type="password" required minLength={MIN_PASSWORD_LENGTH} maxLength={72} autoComplete="new-password" className={inputClass} />
          </div>
          <div>
            <label htmlFor="confirm" className={labelClass}>Repeat new password</label>
            <input id="confirm" name="confirm" type="password" required autoComplete="new-password" className={inputClass} />
          </div>
          <div><button type="submit" className={buttonClass}>Change password</button></div>
        </AdminForm>
      </section>

      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-medium">Recent activity</h2>
        {activity.length === 0 ? (
          <p className="mt-2 text-sm text-black/60">Nothing recorded yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-black/5 text-sm">
            {activity.map((entry) => (
              <li key={entry.id} className="flex flex-wrap justify-between gap-2 py-2">
                <span>{entry.action}</span>
                <span className="text-xs text-black/45">{entry.adminEmail} · {formatNairobi(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
