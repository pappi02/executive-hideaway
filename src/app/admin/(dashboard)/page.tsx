import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [serviceCount, chapterCount, dishCount] = await Promise.all([
    prisma.service.count(),
    prisma.chapter.count(),
    prisma.dish.count(),
  ]);

  const cards = [
    { href: "/admin/services", label: "Services", count: serviceCount, sub: "barber & spa services" },
    { href: "/admin/menu", label: "Menu chapters", count: chapterCount, sub: "in the resort menu" },
    { href: "/admin/menu", label: "Menu dishes", count: dishCount, sub: "across all chapters" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[-0.03em]">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
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
