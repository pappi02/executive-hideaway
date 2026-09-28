import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateService } from "../../actions";
import { ServiceForm } from "../../ServiceForm";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [service, categories] = await Promise.all([
    prisma.service.findUnique({ where: { id } }),
    prisma.serviceCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!service) notFound();

  const updateWithId = updateService.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[-0.03em]">Edit service</h1>
      <ServiceForm
        action={updateWithId}
        categories={categories}
        defaultValues={service}
        submitLabel="Save changes"
      />
    </div>
  );
}
