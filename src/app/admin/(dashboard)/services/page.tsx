import Link from "next/link";
import { MoveButtons } from "@/components/admin/MoveButtons";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { ServiceRow } from "./ServiceRow";
import { DeleteServiceButton } from "./DeleteServiceButton";
import { moveService } from "./actions";

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-[-0.03em]">Services</h1>

        <Link
          href="/admin/services/new"
          className="rounded-full bg-(--accent) px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0b0b0a] transition-all duration-300 hover:bg-(--accent-light)"
        >
          New service
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/2 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/45">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <ServiceRow key={service.id} id={service.id}>
                <td className="px-4 py-3 font-medium">{service.name}</td>
                <td className="px-4 py-3 text-black/60">{service.category.label}</td>
                <td className="px-4 py-3 text-black/60">
                  {service.price === null ? "On request" : `KSh ${service.price.toLocaleString()}`}
                </td>
                <td className="px-4 py-3 text-black/60">{service.duration} min</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <MoveButtons
                      id={service.id}
                      action={moveService}
                      isFirst={services[index - 1]?.categoryId !== service.categoryId}
                      isLast={services[index + 1]?.categoryId !== service.categoryId}
                      label={service.name}
                    />
                    <DeleteServiceButton id={service.id} name={service.name} />
                  </div>
                </td>
              </ServiceRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
