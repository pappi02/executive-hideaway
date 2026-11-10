import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { posterImageSrc } from "@/lib/posters";
import { toNairobiInput } from "@/lib/poster-time";
import { createPoster, updatePoster } from "../actions";
import { DeletePosterButton } from "../PosterControls";
import { PosterForm } from "../PosterForm";

export default async function PosterFormPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  if (id === "new") {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-[-0.03em]">New poster</h1>
        <PosterForm action={createPoster} submitLabel="Create poster" successMessage="Poster created" />
      </div>
    );
  }

  const poster = await prisma.poster.findUnique({ where: { id }, omit: { imageData: true } });
  if (!poster) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-[-0.03em]">Edit poster</h1>
        <DeletePosterButton id={poster.id} title={poster.title} redirectTo="/admin/posters" />
      </div>
      <PosterForm
        action={updatePoster.bind(null, id)}
        defaultValues={{
          title: poster.title,
          imageUrl: posterImageSrc(poster),
          linkUrl: poster.linkUrl,
          startsAt: toNairobiInput(poster.startsAt),
          endsAt: toNairobiInput(poster.endsAt),
          delaySeconds: poster.delaySeconds,
          autoCloseSeconds: poster.autoCloseSeconds,
          timesPerDay: poster.timesPerDay,
          priority: poster.priority,
          active: poster.active,
          kind: poster.kind,
          summary: poster.summary,
          highlights: poster.highlights,
          details: poster.details,
          priceText: poster.priceText,
          location: poster.location,
          ctaLabel: poster.ctaLabel,
          terms: poster.terms,
        }}
        submitLabel="Save changes"
        successMessage="Poster updated"
      />
    </div>
  );
}
