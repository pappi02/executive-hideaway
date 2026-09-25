export type GalleryCategory =
  | "barbering"
  | "spa & massage"
  | "wellness"
  | "interior & details";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  /** Portrait images span taller in the masonry grid on /gallery. */
  orientation?: "landscape" | "portrait";
}

export const galleryCategories: { id: GalleryCategory; label: string }[] = [
  { id: "barbering", label: "Barbering" },
  { id: "spa & massage", label: "Spa & Massage" },
  { id: "wellness", label: "Wellness" },
  { id: "interior & details", label: "Interior & Details" },
];

export const galleryImages: GalleryImage[] = [
  {
    id: "barbering",
    src: "/images/gallery/gallery-barbering.webp",
    alt: "Lavish, dimly lit barbershop interior with premium wood-panel styling stations",
    category: "interior & details",
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
    id: "products",
    src: "/images/gallery/gallery-products.webp",
    alt: "Premium grooming products displayed on the barbershop counter",
    category: "interior & details",
    orientation: "portrait",
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
    id: "lounge-interior",
    src: "/images/gallery/gallery-lounge-interior.webp",
    alt: "Warmly lit barbershop lounge with vintage leather chairs mid-appointment",
    category: "interior & details",
  },
  {
    id: "chair-mirror",
    src: "/images/gallery/gallery-chair-mirror.webp",
    alt: "Classic barber chair and mirror station in a well-appointed barbershop",
    category: "interior & details",
  },
  {
    id: "sauna-wood",
    src: "/images/gallery/gallery-sauna-wood.webp",
    alt: "Client relaxing inside a warm wooden sauna",
    category: "wellness",
    orientation: "portrait",
  },
  {
    id: "counter-tools",
    src: "/images/gallery/gallery-counter-tools.webp",
    alt: "Barbershop counter neatly stocked with grooming tools and products",
    category: "interior & details",
  },
];
