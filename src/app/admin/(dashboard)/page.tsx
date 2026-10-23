import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminHomePage() {
  await requireAdmin();
  const [serviceCount, accommodationCount, chapterCount, dishCount, livePosterCount] = await Promise.all([
    prisma.service.count(),
    prisma.accommodation.count(),
    prisma.chapter.count(),
    prisma.dish.count(),
    prisma.poster.count({ where: { active: true, startsAt: { lte: new Date() }, endsAt: { gt: new Date() } } }),
  ]);

  const cards = [
    { href: "/admin/services", label: "Services", count: serviceCount, sub: "barber & spa services" },
    { href: "/admin/accommodation", label: "Accommodation", count: accommodationCount, sub: "room types" },
    { href: "/admin/menu", label: "Menu chapters", count: chapterCount, sub: "in the resort menu" },
    { href: "/admin/menu", label: "Menu dishes", count: dishCount, sub: "across all chapters" },
    { href: "/admin/posters", label: "Live posters", count: livePosterCount, sub: "pop-ups on the site now" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[-0.03em]">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-black/10 bg-white p-6 transition-colors hover:border-(--accent)"
          >
            <p className="text-4xl font-light tracking-[-0.03em]">{card.count}</p>
            <p className="mt-1 text-sm font-medium">{card.label}</p>
            <p className="text-xs text-black/45">{card.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
