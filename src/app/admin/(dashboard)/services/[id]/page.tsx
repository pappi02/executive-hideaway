import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createService, updateService } from "../actions";
import { ServiceForm } from "../ServiceForm";

export default async function ServiceFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  const categories = await prisma.serviceCategory.findMany({ orderBy: { order: "asc" } });

  if (isNew) {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-[-0.03em]">New service</h1>
        <ServiceForm action={createService} categories={categories} submitLabel="Create service" />
      </div>
    );
  }

  const service = await prisma.service.findUnique({ where: { id } });
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
