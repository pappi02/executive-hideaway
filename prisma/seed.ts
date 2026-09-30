/**
 * One-time (re-runnable) seed: loads the site's original hardcoded content
 * into the database so nothing is lost when services.ts / menu data switch
 * to being DB-backed. Safe to run more than once — every write is an upsert.
 *
 * Run with: npm run db:seed
 */
import { loadEnvFile } from "node:process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { chapters } from "../src/app/menu/data/menu";

try {
  loadEnvFile(path.resolve(import.meta.dirname, "../.env.local"));
} catch {
  // .env.local not present — fine when DATABASE_URL etc. are set another way.
}

const prisma = new PrismaClient();

const categoryImages = {
  haircut: "/images/services/normal-hair-cut.webp",
  massage: "/images/services/hot-stone-massage.webp",
  facial: "/images/services/facial.webp",
  "spa treatment": "/images/services/full-day-experience.webp",
  "nail care": "/images/services/manicure.webp",
  wellness: "/images/services/sauna.webp",
} as const;

const serviceCategories = [
  {
    id: "haircut",
    label: "Hair & Grooming",
    eyebrow: "Signature styling",
    description:
      "Refined grooming experiences focused on precision, comfort, and a polished finish.",
    image: categoryImages.haircut,
    imageAlt: "Hair and grooming service",
    order: 0,
  },
  {
    id: "massage",
    label: "Massage Therapy",
    eyebrow: "Restorative care",
    description:
      "Targeted massage treatments designed to release tension and restore balance to the body.",
    image: categoryImages.massage,
    imageAlt: "Massage therapy treatment",
    order: 1,
  },
  {
    id: "spa treatment",
    label: "Spa Treatments",
    eyebrow: "Wellness rituals",
    description:
      "Immersive spa rituals and therapeutic experiences that help you unwind and reset.",
    image: categoryImages["spa treatment"],
    imageAlt: "Spa treatment experience",
    order: 2,
  },
  {
    id: "facial",
    label: "Facials",
    eyebrow: "Skin renewal",
    description:
      "Smart, skin-focused facial rituals to revive hydration, clarity, and glow.",
    image: categoryImages.facial,
    imageAlt: "Facial treatment",
    order: 3,
  },
  {
    id: "nail care",
    label: "Nail Care",
    eyebrow: "Hands & feet",
    description:
      "Precise, restorative nail and foot care that leaves you polished and refreshed.",
    image: categoryImages["nail care"],
    imageAlt: "Nail care service",
    order: 4,
  },
  {
    id: "wellness",
    label: "Wellness",
    eyebrow: "Holistic care",
    description:
      "Thoughtful wellness services designed to support recovery, ease, and everyday vitality.",
    image: categoryImages.wellness,
    imageAlt: "Wellness session",
    order: 5,
  },
];

const services = [
  { id: "aromatherapy-massage", name: "Aromatherapy Massage", category: "massage", description: "A soothing massage combining soft and firm pressure with scented essential oils to encourage relaxation and leave the body feeling refreshed.", price: 6000, duration: 75, image: "/images/services/aromatherapy-massage.webp", imageAlt: "Therapist pouring aromatherapy oil onto a client's back before a massage" },
  { id: "body-scrub", name: "Body Scrub", category: "spa treatment", description: "An uplifting treatment using coffee and coconut oil to exfoliate the skin and leave the body feeling smooth and refreshed.", price: 3000, duration: 45, image: "/images/services/body-scrub.webp", imageAlt: "Coffee bean body scrub and exfoliating brush used for a body scrub treatment" },
  { id: "body-stretches", name: "Body Stretches", category: "spa treatment", description: "A guided stretching experience designed to help improve flexibility, mobility, and overall body comfort.", price: 2000, duration: 30, image: "/images/services/body-stretches.webp", imageAlt: "Therapist assisting a client with a guided body stretch" },
  { id: "couples-massage", name: "Couples Massage", category: "massage", description: "A shared massage experience where two therapists work simultaneously to create a relaxing and intimate experience for two.", price: 10000, duration: 90, image: "/images/services/couples-massage.webp", imageAlt: "Two clients receiving a massage side by side from two therapists" },
  { id: "deep-tissue-massage", name: "Deep Tissue Massage", category: "massage", description: "A focused massage using deeper pressure to target muscle tension and areas of physical stress.", price: 5000, duration: 75, image: "/images/services/deep-tissue-massage.webp", imageAlt: "Therapist applying firm deep tissue pressure to a client's back" },
  { id: "facial", name: "Facial", category: "facial", description: "A signature facial experience combining cleansing, exfoliation, steam, customized extractions, and skin rejuvenation.", price: 4000, duration: 60, image: "/images/services/facial.webp", imageAlt: "Client having facial cream applied to her cheek during a facial treatment" },
  { id: "full-day-experience", name: "Full Day Experience", category: "spa treatment", description: "A complete day dedicated to relaxation and personal care, with treatments designed around your comfort.", price: 50000, duration: 240, image: "/images/services/full-day-experience.webp", imageAlt: "Client relaxing on a spa table surrounded by rose petals during a full day spa experience" },
  { id: "fun-and-entertainment", name: "Fun & Entertainment", category: "spa treatment", description: "A selection of recreational experiences including yoga sessions and private entertainment options.", price: null, duration: 165, image: "/images/services/fun-and-entertainment.webp", imageAlt: "Woman in a yoga pose during a recreational wellness session" },
  { id: "hot-stone-massage", name: "Hot Stone Massage", category: "massage", description: "A therapeutic massage incorporating heated stones to promote deep relaxation and ease muscular tension.", price: 7500, duration: 90, image: "/images/services/hot-stone-massage.webp", imageAlt: "Heated massage stones and orchid petals arranged along a client's back" },
  { id: "m2m-massage", name: "M2M Massage", category: "massage", description: "A massage experience available with male therapists, offering clients another option for their personal care experience.", price: null, duration: 120, image: "/images/services/m2m-massage.webp", imageAlt: "Male therapist massaging a client's back" },
  { id: "manicure", name: "Manicure", category: "nail care", description: "A multi-step nail care ritual designed to leave hands and nails looking polished and well cared for.", price: 2000, duration: 60, image: "/images/services/manicure.webp", imageAlt: "Manicurist applying nail polish to a client's hand" },
  { id: "moroccan-bath", name: "Moroccan Bath", category: "spa treatment", description: "A traditional cleansing ritual incorporating steam, black soap, exfoliation, and moisturizing treatments.", price: null, duration: 60, image: "/images/services/moroccan-bath.webp", imageAlt: "Client relaxing during a traditional cleansing bath ritual" },
  { id: "normal-hair-cut", name: "Normal Hair Cut", category: "haircut", description: "A haircut of your choice accompanied by a dye application, mini facial, and head and neck massage.", price: 2000, duration: 45, image: "/images/services/normal-hair-cut.webp", imageAlt: "Barber cutting a client's hair with clippers at the barbershop" },
  { id: "pedicure", name: "Pedicure", category: "nail care", description: "A comprehensive foot treatment focused on nail care, foot care, comfort, and relaxation.", price: 4000, duration: 60, image: "/images/services/pedicure.webp", imageAlt: "Therapist massaging a client's foot during a pedicure treatment" },
  { id: "premium-head-care", name: "Premium Head Care", category: "haircut", description: "An executive haircut experience complemented by a Japanese head spa wash, dye application, mini facial, and head and neck massage.", price: 7000, duration: 75, image: "/images/services/premium-head-care.webp", imageAlt: "Barber trimming a client's hairline with precision clippers" },
  { id: "prenatal-massage", name: "Prenatal Massage", category: "massage", description: "A gentle and calming massage experience designed for pregnancy after the first trimester.", price: 5000, duration: 60, image: "/images/services/prenatal-massage.webp", imageAlt: "Therapist gently massaging a pregnant client's belly" },
  { id: "reflexology-massage", name: "Reflexology Massage", category: "massage", description: "A focused treatment working on pressure points of the feet, hands, and ears to encourage relaxation and balance.", price: 3000, duration: 60, image: "/images/services/reflexology-massage.webp", imageAlt: "Therapist applying pressure to points on a client's foot during reflexology" },
  { id: "sauna", name: "Sauna", category: "spa treatment", description: "A heat-based relaxation experience designed to provide a calm environment for unwinding and recovery.", price: 2000, duration: 45, image: "/images/services/sauna.webp", imageAlt: "Warm wooden sauna interior with ambient lighting" },
  { id: "swedish-massage", name: "Swedish Massage", category: "massage", description: "A gentle massage using lighter pressure to promote relaxation and help the body unwind.", price: 4000, duration: 75, image: "/images/services/swedish-massage.webp", imageAlt: "Therapist giving a client a gentle, relaxing back massage" },
  { id: "tantric-experiences", name: "Tantric Experiences", category: "massage", description: "A private sensory experience centered around relaxation, touch, and mindful connection.", price: 10000, duration: 150, image: "/images/services/tantric-experiences.webp", imageAlt: "Client relaxing during a private candlelit massage experience" },
];

const accommodations = [
  {
    name: "Premium Room",
    slug: "premium-room",
    description: "A temporary room listing. Replace this copy with confirmed accommodation details.",
    pricePerNight: 8500,
    isTemporary: true,
    numberOfRooms: 3,
    maxGuests: 2,
    bedType: "Queen Bed",
    bathroom: "Ensuite bathroom",
    amenities: ["Wi-Fi", "Hot shower", "Comfortable bedding"],
    breakfastIncluded: false,
    wifiAvailable: true,
    parkingAvailable: true,
    childrenAllowed: false,
    featured: true,
    active: true,
    order: 0,
    imagePath: "images/accommodation/premium-room.webp",
    imageAlt: "Temporary illustrative room preview; replace with a photo of this room",
  },
  {
    name: "Deluxe Room",
    slug: "deluxe-room",
    description: "A temporary room listing. Replace this copy with confirmed accommodation details.",
    pricePerNight: 11000,
    isTemporary: true,
    numberOfRooms: 2,
    maxGuests: 2,
    bedType: "Double Bed",
    bathroom: "Ensuite bathroom",
    amenities: ["Wi-Fi", "Parking", "Air conditioning", "TV"],
    breakfastIncluded: true,
    wifiAvailable: true,
    parkingAvailable: true,
    childrenAllowed: false,
    featured: false,
    active: true,
    order: 1,
    imagePath: "images/accommodation/deluxe-room.webp",
    imageAlt: "Temporary illustrative room preview; replace with a photo of this room",
  },
  {
    name: "Executive Room",
    slug: "executive-room",
    description: "A temporary room listing. Replace this copy with confirmed accommodation details.",
    pricePerNight: 14500,
    isTemporary: true,
    numberOfRooms: 2,
    maxGuests: 2,
    bedType: "King Bed",
    bathroom: "Ensuite bathroom",
    amenities: ["Wi-Fi", "Hot shower", "Air conditioning", "Comfortable bedding"],
    breakfastIncluded: false,
    wifiAvailable: true,
    parkingAvailable: true,
    childrenAllowed: false,
    featured: false,
    active: true,
    order: 2,
    imagePath: "images/accommodation/executive-room.webp",
    imageAlt: "Temporary illustrative room preview; replace with a photo of this room",
  },
];

const resortFacilities = [
  { name: "Garden", slug: "garden", category: "Grounds", description: "Garden space at the resort.", href: null, active: true, order: 0 },
  { name: "Parking", slug: "parking", category: "Convenience", description: "Parking is available at the property.", href: null, active: true, order: 1 },
  { name: "Wi-Fi", slug: "wifi", category: "Convenience", description: "Wi-Fi is available at the property.", href: null, active: true, order: 2 },
  { name: "Food", slug: "food", category: "Dining", description: "Food is available through the resort menu.", href: "/menu", active: true, order: 3 },
  { name: "Drinks", slug: "drinks", category: "Dining", description: "Drinks are available through the resort menu.", href: "/menu", active: true, order: 4 },
  { name: "Spa & Wellness", slug: "spa-wellness", category: "Wellness", description: "Explore spa and wellness services.", href: "/services", active: true, order: 5 },
  { name: "Barber & Grooming", slug: "barber-grooming", category: "Grooming", description: "Explore barbering and grooming services.", href: "/services", active: true, order: 6 },
];

async function seedAccommodation() {
  for (const room of accommodations) {
    const { imagePath, imageAlt, ...fields } = room;
    const imageData = new Uint8Array(
      await readFile(path.resolve(import.meta.dirname, "../public", imagePath)),
    );

    await prisma.accommodation.upsert({
      where: { slug: room.slug },
      create: {
        ...fields,
        priceIsIndicative: true,
        images: {
          create: {
            data: imageData,
            contentType: "image/webp",
            altText: imageAlt,
            order: 0,
          },
        },
      },
      update: {},
    });
  }

  for (const facility of resortFacilities) {
    await prisma.resortFacility.upsert({
      where: { slug: facility.slug },
      create: facility,
      update: {},
    });
  }

  await prisma.accommodationSettings.upsert({
    where: { id: "default" },
    create: { id: "default", checkIn: null, checkOut: null },
    update: {},
  });

  console.log(`Seeded ${accommodations.length} temporary room types and ${resortFacilities.length} resort experiences.`);
}

async function seedServices() {
  for (const category of serviceCategories) {
    await prisma.serviceCategory.upsert({
      where: { id: category.id },
      create: category,
      update: category,
    });
  }

  for (const [index, service] of services.entries()) {
    const { category, ...rest } = service;
    const data = { ...rest, categoryId: category, order: index };

    await prisma.service.upsert({
      where: { id: service.id },
      create: data,
      update: data,
    });
  }

  console.log(`Seeded ${serviceCategories.length} categories, ${services.length} services.`);
}

async function seedMenu() {
  let chapterOrder = 0;
  let dishTotal = 0;

  for (const chapter of chapters) {
    await prisma.chapter.upsert({
      where: { id: chapter.id },
      create: {
        id: chapter.id,
        eyebrow: chapter.eyebrow,
        title: chapter.title,
        standfirst: chapter.standfirst,
        image: chapter.image,
        imagePosition: chapter.imagePosition,
        note: chapter.note,
        footnote: chapter.footnote,
        columns: chapter.columns ?? 1,
        stock: chapter.stock ?? "onyx",
        order: chapterOrder,
      },
      update: {
        eyebrow: chapter.eyebrow,
        title: chapter.title,
        standfirst: chapter.standfirst,
        image: chapter.image,
        imagePosition: chapter.imagePosition,
        note: chapter.note,
        footnote: chapter.footnote,
        columns: chapter.columns ?? 1,
        stock: chapter.stock ?? "onyx",
        order: chapterOrder,
      },
    });
    chapterOrder += 1;

    let sectionOrder = 0;
    for (const section of chapter.sections) {
      await prisma.section.upsert({
        where: { id: section.id },
        create: {
          id: section.id,
          chapterId: chapter.id,
          title: section.title,
          note: section.note,
          order: sectionOrder,
        },
        update: {
          chapterId: chapter.id,
          title: section.title,
          note: section.note,
          order: sectionOrder,
        },
      });
      sectionOrder += 1;

      let dishOrder = 0;
      for (const dish of section.dishes) {
        await prisma.dish.upsert({
          where: { id: dish.id },
          create: {
            id: dish.id,
            sectionId: section.id,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            priceNote: dish.priceNote,
            tags: dish.tags ?? [],
            unavailable: dish.unavailable ?? false,
            order: dishOrder,
          },
          update: {
            sectionId: section.id,
            name: dish.name,
            description: dish.description,
            price: dish.price,
            priceNote: dish.priceNote,
            tags: dish.tags ?? [],
            unavailable: dish.unavailable ?? false,
            order: dishOrder,
          },
        });
        dishOrder += 1;
        dishTotal += 1;
      }
    }
  }

  console.log(`Seeded ${chapters.length} chapters, ${dishTotal} dishes.`);
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(
      "Skipped admin seed: set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env.local to create the first admin login.",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });

  console.log(`Seeded admin account: ${email}`);
}

async function main() {
  await seedServices();
  await seedMenu();
  await seedAccommodation();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
