import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AccommodationForm, type AccommodationFormValues } from "../AccommodationForm";
import { AccommodationImageManager } from "../AccommodationImageManager";
import { createAccommodation, updateAccommodation } from "../actions";
import { DeleteAccommodationButton } from "../DeleteAccommodationButton";

export default async function AccommodationEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  if (isNew) {
    return (
      <div>
        <h1 className="text-2xl font-light">Add room type</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-black/55">Room details are editable after creation. Add confirmed room photographs from the editor once the room record exists.</p>
        <AccommodationForm action={createAccommodation} submitLabel="Create room type" successMessage="Room type created." />
      </div>
    );
  }

  const room = await prisma.accommodation.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" }, select: { id: true, altText: true, order: true } } },
  });
  if (!room) notFound();

  const values: AccommodationFormValues = {
    id: room.id,
    name: room.name,
    slug: room.slug,
    description: room.description,
    pricePerNight: room.pricePerNight,
    priceIsIndicative: room.priceIsIndicative,
    isTemporary: room.isTemporary,
    numberOfRooms: room.numberOfRooms,
    maxGuests: room.maxGuests,
    bedType: room.bedType,
    roomSize: room.roomSize,
    bathroom: room.bathroom,
    amenities: room.amenities,
    breakfastIncluded: room.breakfastIncluded,
    wifiAvailable: room.wifiAvailable,
    parkingAvailable: room.parkingAvailable,
    childrenAllowed: room.childrenAllowed,
    featured: room.featured,
    active: room.active,
  };
  const updateWithId = updateAccommodation.bind(null, room.id);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/45">Accommodation</p>
          <h1 className="mt-1 wrap-break-word text-2xl font-light">Edit {room.name}</h1>
        </div>
        <DeleteAccommodationButton id={room.id} name={room.name} />
      </div>
      <AccommodationForm action={updateWithId} defaultValues={values} submitLabel="Save room details" successMessage="Room details saved." />
      <AccommodationImageManager accommodationId={room.id} images={room.images} />
    </div>
  );
}