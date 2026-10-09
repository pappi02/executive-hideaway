import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/auth";
import { ToastProvider } from "@/components/admin/Toast";
import { requireAdmin } from "@/lib/require-admin";

// Auth-gated and always reflects live DB state — never statically prerendered.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/accommodation", label: "Accommodation" },
  { href: "/admin/menu", label: "Menu" },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts already redirects anonymous visitors; checking here too means the
  // dashboard never renders on the strength of the proxy alone.
  await requireAdmin();

  return (
    <ToastProvider>
    <div className="min-h-svh bg-[#f3efe6] text-[#0b0b0a]">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="flex shrink-0 items-center gap-3" aria-label="Executive Hideaway admin dashboard">
            <Image
              src="/images/eh-logo.png"
              alt="Executive Hideaway Spa and Resort"
              width={960}
              height={600}
              sizes="72px"
              className="h-11 w-auto"
            />
            <span className="border-l border-black/15 pl-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Admin
            </span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60 transition-colors hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/50 transition-colors hover:text-black"
          >
            Sign out
          </button>
        </form>
      </header>

      <nav className="flex items-center gap-6 overflow-x-auto border-b border-black/10 bg-white px-5 py-3 sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">{children}</main>
    </div>
    </ToastProvider>
  );
}
