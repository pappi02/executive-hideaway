import { prisma } from "@/lib/prisma";
import { createService } from "../actions";
import { ServiceForm } from "../ServiceForm";

export default async function NewServicePage() {
  const categories = await prisma.serviceCategory.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[-0.03em]">New service</h1>
      <ServiceForm action={createService} categories={categories} submitLabel="Create service" />
    </div>
  );
}
