export type GalleryCategory =
  | "the venue"
  | "barbering"
  | "spa & massage"
  | "wellness";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Portrait images span taller in the masonry grid on /gallery. */
  orientation?: "landscape" | "portrait";
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "the venue", label: "The Venue" },
  { id: "barbering", label: "Barbering" },
  { id: "spa & massage", label: "Spa & Massage" },
  { id: "wellness", label: "Wellness" },
];

export const galleryImages: GalleryImage[] = [
  // Real photographs of the venue (owner, November 2026), first.
  {
    id: "venue-barber-stations",
    src: "/images/venue/barber-stations-chandelier.webp",
    alt: "The barber stations: two black leather chairs and lit oval mirrors under a crystal chandelier",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-lounge-fireplace",
    src: "/images/venue/lounge-fireplace-barber-view.webp",
    alt: "The lounge, with a grey sofa, a white coffee table and the barber stations beyond",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-throne-chairs",
    src: "/images/venue/throne-chairs-lounge-decanter.webp",
    alt: "Gold-trimmed throne chairs in the lounge, with a decanter set on the coffee table",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-lounge-wide",
    src: "/images/venue/lounge-pool-wide-landscape.webp",
    alt: "The lounge and pool table, with the fireplace wall and staircase behind",
    category: "the venue",
  },
  {
    id: "venue-barber-lounge",
    src: "/images/venue/barber-lounge-chandelier.webp",
    alt: "The barber area with its chandelier, wall shelves and oval mirrors",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-bar",
    src: "/images/venue/bar-cabinet-front.webp",
    alt: "The bar cabinet, lit blue, stocked with spirits, soft drinks and glassware",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-staircase",
    src: "/images/venue/staircase-lounge-barber-view.webp",
    alt: "The staircase lounge, looking through to the barber stations",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-lounge-sofa",
    src: "/images/venue/lounge-sofa-throne-chairs.webp",
    alt: "A light sofa and throne chairs on the parquet floor of the lounge",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-pool-throne",
    src: "/images/venue/pool-table-throne-chairs.webp",
    alt: "The pool table racked and ready in front of the throne chairs",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "venue-lounge-pool",
    src: "/images/venue/lounge-pool-throne-wide.webp",
    alt: "The full lounge: pool table, throne chairs and a white coffee table",
    category: "the venue",
    orientation: "portrait",
  },
  {
    id: "grooming",
    src: "/images/gallery/gallery-grooming.webp",
    alt: "Barber giving a client a precise straight-razor beard trim",
    category: "barbering",
    orientation: "portrait",
  },
  {
    id: "massage",
    src: "/images/gallery/gallery-massage.webp",
    alt: "Male client receiving a relaxing shoulder massage from a therapist",
    category: "spa & massage",
  },
  {
    id: "smiling-client",
    src: "/images/gallery/gallery-smiling-client.webp",
    alt: "Client smiling mid-haircut in a bright, modern barbershop",
    category: "barbering",
  },
  {
    id: "clipper-detail",
    src: "/images/gallery/gallery-clipper-detail.webp",
    alt: "Barber's clipper detail as a client's fade is shaped up",
    category: "barbering",
    orientation: "portrait",
  },
  {
    id: "facial",
    src: "/images/gallery/gallery-facial.webp",
    alt: "Male client receiving a facial treatment, eyes closed and relaxed",
    category: "spa & massage",
  },
  {
    id: "mature-client",
    src: "/images/gallery/gallery-mature-client.webp",
    alt: "Barber combing a mature client's hair with care and precision",
    category: "barbering",
  },
  {
    id: "wellness",
    src: "/images/gallery/gallery-wellness.webp",
    alt: "Clients unwinding together in the wooden sauna",
    category: "wellness",
  },
  {
    id: "bw-editorial",
    src: "/images/gallery/gallery-bw-editorial.webp",
    alt: "Black-and-white editorial shot of a barber shaping a client's hairline",
    category: "barbering",
    orientation: "portrait",
  },
  {
    id: "finished-look",
    src: "/images/gallery/gallery-finished-look.webp",
    alt: "Client admiring his fresh haircut and beard trim",
    category: "barbering",
  },
  {
    id: "serene-cut",
    src: "/images/gallery/gallery-serene-cut.webp",
    alt: "Client relaxing during a warm rinse at the styling basin",
    category: "spa & massage",
  },
  {
    id: "scissors-trim",
    src: "/images/gallery/gallery-scissors-trim.webp",
    alt: "Barber trimming a client's hairline with precision clippers",
    category: "barbering",
    orientation: "portrait",
  },
  {
    id: "beard-detail",
    src: "/images/gallery/gallery-beard-detail.webp",
    alt: "Close-up of a barber shaping a client's beard with scissors and comb",
    category: "barbering",
  },
  {
    id: "clipper-profile",
    src: "/images/gallery/gallery-clipper-profile.webp",
    alt: "Side profile of a client mid-haircut in the barber's chair",
    category: "barbering",
  },
  {
    id: "detail",
    src: "/images/gallery/gallery-detail.webp",
    alt: "Close-up detail of hands, capturing the touch of a spa treatment",
    category: "spa & massage",
    orientation: "portrait",
  },
  {
    id: "sauna-wood",
    src: "/images/gallery/gallery-sauna-wood.webp",
    alt: "Client relaxing inside a warm wooden sauna",
    category: "wellness",
    orientation: "portrait",
  },
];
