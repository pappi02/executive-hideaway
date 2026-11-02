import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";
import { AdminForm } from "@/components/admin/AdminForm";
import {
  deleteAccommodationImage,
  moveAccommodationImage,
  updateAccommodationImageAlt,
  uploadAccommodationImages,
} from "./actions";
import { accommodationImageSrc } from "@/lib/accommodation-image-src";

interface RoomImage {
  id: string;
  url: string | null;
  altText: string;
  order: number;
}

const inputClass =
  "min-h-10 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-(--accent) focus-visible:ring-2 focus-visible:ring-(--accent)/30";

export function AccommodationImageManager({
  accommodationId,
  images,
}: {
  accommodationId: string;
  images: RoomImage[];
}) {
  const uploadAction = uploadAccommodationImages.bind(null, accommodationId);

  return (
    <section className="mt-10 max-w-3xl border-t border-black/10 pt-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-light">Room photography</h2>
        <p className="text-xs text-black/45">The first image is the cover. Reorder images to change it.</p>
      </div>

      <AdminForm action={uploadAction} successMessage="Room images uploaded." className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="images" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/55">Choose images</label>
          <input id="images" name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple required className="block min-h-11 w-full text-xs file:mr-3 file:min-h-10 file:rounded-md file:border-0 file:bg-black/5 file:px-3 file:text-xs" />
        </div>
        <div>
          <label htmlFor="altText" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] text-black/55">Initial image description</label>
          <input id="altText" name="altText" required maxLength={240} className={inputClass} />
        </div>
        <button type="submit" className="min-h-11 rounded-full bg-(--accent) px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0b0b0a] hover:bg-(--accent-light) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          Upload
        </button>
        <p className="text-xs leading-5 text-black/45 sm:col-span-3">JPEG, PNG, or WebP. Up to 4 MB per upload (send large sets in batches), and 12 images per room. Edit descriptions individually after upload.</p>
      </AdminForm>

      {images.length ? (
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <li key={image.id} className="overflow-hidden border border-black/10 bg-white">
              <div className="relative aspect-4/3 bg-black/5">
                <Image
                  src={accommodationImageSrc(image)}
                  alt={image.altText}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
                {index === 0 && <span className="absolute left-3 top-3 bg-[#0b0b0a]/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">Cover image</span>}
              </div>
              <div className="space-y-3 p-3">
                <AdminForm action={updateAccommodationImageAlt} successMessage="Image description saved." className="flex gap-2">
                  <input type="hidden" name="id" value={image.id} />
                  <label className="sr-only" htmlFor={`alt-${image.id}`}>Image description</label>
                  <input id={`alt-${image.id}`} name="altText" required maxLength={240} defaultValue={image.altText} className={inputClass} />
                  <button type="submit" className="min-h-10 shrink-0 px-2 text-[10px] font-semibold uppercase tracking-widest text-black/60 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">Save</button>
                </AdminForm>
                <div className="flex items-center justify-between border-t border-black/8 pt-2">
                  <div className="flex gap-1">
                    <AdminForm action={moveAccommodationImage} successMessage="Image order updated.">
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button type="submit" disabled={index === 0} aria-label="Move image earlier" className="inline-flex min-h-9 min-w-9 items-center justify-center text-black/55 hover:text-black disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"><ArrowUp size={15} aria-hidden="true" /></button>
                    </AdminForm>
                    <AdminForm action={moveAccommodationImage} successMessage="Image order updated.">
                      <input type="hidden" name="id" value={image.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button type="submit" disabled={index === images.length - 1} aria-label="Move image later" className="inline-flex min-h-9 min-w-9 items-center justify-center text-black/55 hover:text-black disabled:opacity-25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"><ArrowDown size={15} aria-hidden="true" /></button>
                    </AdminForm>
                  </div>
                  <AdminForm action={deleteAccommodationImage} successMessage="Room image removed.">
                    <input type="hidden" name="id" value={image.id} />
                    <button type="submit" className="min-h-9 px-2 text-[10px] font-semibold uppercase tracking-widest text-red-700/75 hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700">Remove image</button>
                  </AdminForm>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-6 border border-dashed border-black/20 px-4 py-6 text-sm text-black/55">No room photos yet. Upload at least one image to feature this room publicly.</p>
      )}
    </section>
  );
}