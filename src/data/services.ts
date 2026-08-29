export type ServiceCategory =
  | "haircut"
  | "massage"
  | "facial"
  | "spa treatment"
  | "nail care"
  | "wellness";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  price: number | null;
  duration: number;
  image: string;
  imageAlt: string;
}

const categoryImages: Record<ServiceCategory, string> = {
  haircut: "/images/barbering.png",
  massage: "/images/spaandcare.png",
  facial: "/images/spaandcare.png",
  "spa treatment": "/images/spaandcare.png",
  "nail care": "/images/spaandcare.png",
  wellness: "/images/wellness.jpg",
};

export const services: Service[] = [
  {
    id: "aromatherapy-massage",
    name: "Aromatherapy Massage",
    category: "massage",
    description:
      "A soothing massage combining soft and firm pressure with scented essential oils to encourage relaxation and leave the body feeling refreshed.",
    price: 6000,
    duration: 75,
    image: categoryImages.massage,
    imageAlt: "Aromatherapy massage treatment",
  },
  {
    id: "body-scrub",
    name: "Body Scrub",
    category: "spa treatment",
    description:
      "An uplifting treatment using coffee and coconut oil to exfoliate the skin and leave the body feeling smooth and refreshed.",
    price: 3000,
    duration: 45,
    image: categoryImages["spa treatment"],
    imageAlt: "Body scrub treatment",
  },
  {
    id: "body-stretches",
    name: "Body Stretches",
    category: "spa treatment",
    description:
      "A guided stretching experience designed to help improve flexibility, mobility, and overall body comfort.",
    price: 2000,
    duration: 30,
    image: categoryImages["spa treatment"],
    imageAlt: "Body stretching session",
  },
  {
    id: "couples-massage",
    name: "Couples Massage",
    category: "massage",
    description:
      "A shared massage experience where two therapists work simultaneously to create a relaxing and intimate experience for two.",
    price: 10000,
    duration: 90,
    image: categoryImages.massage,
    imageAlt: "Couples massage treatment",
  },
  {
    id: "deep-tissue-massage",
    name: "Deep Tissue Massage",
    category: "massage",
    description:
      "A focused massage using deeper pressure to target muscle tension and areas of physical stress.",
    price: 5000,
    duration: 75,
    image: categoryImages.massage,
    imageAlt: "Deep tissue massage treatment",
  },
  {
    id: "facial",
    name: "Facial",
    category: "facial",
    description:
      "A signature facial experience combining cleansing, exfoliation, steam, customized extractions, and skin rejuvenation.",
    price: 4000,
    duration: 60,
    image: categoryImages.facial,
    imageAlt: "Facial treatment",
  },
  {
    id: "full-day-experience",
    name: "Full Day Experience",
    category: "spa treatment",
    description:
      "A complete day dedicated to relaxation and personal care, with treatments designed around your comfort.",
    price: 50000,
    duration: 240,
    image: categoryImages["spa treatment"],
    imageAlt: "Full day spa experience",
  },
  {
    id: "fun-and-entertainment",
    name: "Fun & Entertainment",
    category: "spa treatment",
    description:
      "A selection of recreational experiences including yoga sessions and private entertainment options.",
    price: null,
    duration: 165,
    image: categoryImages["spa treatment"],
    imageAlt: "Entertainment and wellness experience",
  },
  {
    id: "hot-stone-massage",
    name: "Hot Stone Massage",
    category: "massage",
    description:
      "A therapeutic massage incorporating heated stones to promote deep relaxation and ease muscular tension.",
    price: 7500,
    duration: 90,
    image: categoryImages.massage,
    imageAlt: "Hot stone massage treatment",
  },
  {
    id: "m2m-massage",
    name: "M2M Massage",
    category: "massage",
    description:
      "A massage experience available with male therapists, offering clients another option for their personal care experience.",
    price: null,
    duration: 120,
    image: categoryImages.massage,
    imageAlt: "Massage treatment",
  },
  {
    id: "manicure",
    name: "Manicure",
    category: "nail care",
    description:
      "A multi-step nail care ritual designed to leave hands and nails looking polished and well cared for.",
    price: 2000,
    duration: 60,
    image: categoryImages["nail care"],
    imageAlt: "Manicure treatment",
  },
  {
    id: "moroccan-bath",
    name: "Moroccan Bath",
    category: "spa treatment",
    description:
      "A traditional cleansing ritual incorporating steam, black soap, exfoliation, and moisturizing treatments.",
    price: null,
    duration: 60,
    image: categoryImages["spa treatment"],
    imageAlt: "Moroccan bath treatment",
  },
  {
    id: "normal-hair-cut",
    name: "Normal Hair Cut",
    category: "haircut",
    description:
      "A haircut of your choice accompanied by a dye application, mini facial, and head and neck massage.",
    price: 2000,
    duration: 45,
    image: categoryImages.haircut,
    imageAlt: "Professional haircut",
  },
  {
    id: "pedicure",
    name: "Pedicure",
    category: "nail care",
    description:
      "A comprehensive foot treatment focused on nail care, foot care, comfort, and relaxation.",
    price: 4000,
    duration: 60,
    image: categoryImages["nail care"],
    imageAlt: "Pedicure treatment",
  },
  {
    id: "premium-head-care",
    name: "Premium Head Care",
    category: "haircut",
    description:
      "An executive haircut experience complemented by a Japanese head spa wash, dye application, mini facial, and head and neck massage.",
    price: 7000,
    duration: 75,
    image: categoryImages.haircut,
    imageAlt: "Premium head care treatment",
  },
  {
    id: "prenatal-massage",
    name: "Prenatal Massage",
    category: "massage",
    description:
      "A gentle and calming massage experience designed for pregnancy after the first trimester.",
    price: 5000,
    duration: 60,
    image: categoryImages.massage,
    imageAlt: "Prenatal massage treatment",
  },
  {
    id: "reflexology-massage",
    name: "Reflexology Massage",
    category: "massage",
    description:
      "A focused treatment working on pressure points of the feet, hands, and ears to encourage relaxation and balance.",
    price: 3000,
    duration: 60,
    image: categoryImages.massage,
    imageAlt: "Reflexology massage treatment",
  },
  {
    id: "sauna",
    name: "Sauna",
    category: "spa treatment",
    description:
      "A heat-based relaxation experience designed to provide a calm environment for unwinding and recovery.",
    price: 2000,
    duration: 45,
    image: categoryImages["spa treatment"],
    imageAlt: "Sauna experience",
  },
  {
    id: "swedish-massage",
    name: "Swedish Massage",
    category: "massage",
    description:
      "A gentle massage using lighter pressure to promote relaxation and help the body unwind.",
    price: 4000,
    duration: 75,
    image: categoryImages.massage,
    imageAlt: "Swedish massage treatment",
  },
  {
    id: "tantric-experiences",
    name: "Tantric Experiences",
    category: "massage",
    description:
      "A private sensory experience centered around relaxation, touch, and mindful connection.",
    price: 10000,
    duration: 150,
    image: categoryImages.massage,
    imageAlt: "Private relaxation experience",
  },
];

export type ServiceCategoryData = {
  id: ServiceCategory;
  label: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const serviceCategories: ServiceCategoryData[] = [
  {
    id: "haircut",
    label: "Hair & Grooming",
    eyebrow: "Signature styling",
    description:
      "Refined grooming experiences focused on precision, comfort, and a polished finish.",
    image: categoryImages.haircut,
    imageAlt: "Hair and grooming service",
  },
  {
    id: "massage",
    label: "Massage Therapy",
    eyebrow: "Restorative care",
    description:
      "Targeted massage treatments designed to release tension and restore balance to the body.",
    image: categoryImages.massage,
    imageAlt: "Massage therapy treatment",
  },
  {
    id: "spa treatment",
    label: "Spa Treatments",
    eyebrow: "Wellness rituals",
    description:
      "Immersive spa rituals and therapeutic experiences that help you unwind and reset.",
    image: categoryImages["spa treatment"],
    imageAlt: "Spa treatment experience",
  },
  {
    id: "facial",
    label: "Facials",
    eyebrow: "Skin renewal",
    description:
      "Smart, skin-focused facial rituals to revive hydration, clarity, and glow.",
    image: categoryImages.facial,
    imageAlt: "Facial treatment",
  },
  {
    id: "nail care",
    label: "Nail Care",
    eyebrow: "Hands & feet",
    description:
      "Precise, restorative nail and foot care that leaves you polished and refreshed.",
    image: categoryImages["nail care"],
    imageAlt: "Nail care service",
  },
  {
    id: "wellness",
    label: "Wellness",
    eyebrow: "Holistic care",
    description:
      "Thoughtful wellness services designed to support recovery, ease, and everyday vitality.",
    image: categoryImages.wellness,
    imageAlt: "Wellness session",
  },
];

export const getServicesByCategory = (category: ServiceCategory) =>
  services.filter((service) => service.category === category);