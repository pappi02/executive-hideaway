import Link from "next/link";
import { signOut } from "@/auth";
import { ToastProvider } from "@/components/admin/Toast";

// Auth-gated and always reflects live DB state — never statically prerendered.
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/menu", label: "Menu" },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
    <div className="min-h-svh bg-[#f3efe6] text-[#0b0b0a]">
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-4 sm:px-8">
        <div className="flex items-center gap-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em]">
            Executive Hideaway — Admin
          </p>

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

      <nav className="flex items-center gap-6 border-b border-black/10 bg-white px-5 py-3 sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/60"
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
