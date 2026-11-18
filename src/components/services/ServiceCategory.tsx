import Image from "next/image";
import ServiceCard from "./ServiceCard";
import {
  getServicesByCategory,
  type ServiceCategoryData,
} from "@/data/services";

interface ServiceCategoryProps {
  category: ServiceCategoryData;
  index: number;
}

export default async function ServiceCategory({
  category,
  index,
}: ServiceCategoryProps) {
  const categoryServices = await getServicesByCategory(category.id);

  return (
    <section
      id={category.id}
      className="border-t border-black/10 pb-10 pt-8 sm:pb-14 sm:pt-10 lg:pb-16 lg:pt-12"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-12">
        <div
          className={`lg:sticky lg:top-24 ${
            index % 2 !== 0 ? "lg:order-2" : ""
          }`}
        >
          <div className="relative h-44 overflow-hidden rounded-2xl bg-[#ddd7ca] sm:h-56 lg:h-64">
            <div className="relative h-full w-full">
              <Image
                src={category.image}
                alt={category.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.025]"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-black/5" />

              <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
                  {category.eyebrow}
                </p>

                <h3 className="mt-1.5 text-2xl font-light tracking-[-0.03em] text-white sm:text-3xl">
                  {category.label}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className={index % 2 !== 0 ? "lg:order-1" : ""}>
          <div className="mb-10 max-w-xl">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#80683c]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="h-px w-8 bg-[#80683c]/40" />
            </div>

            <h2 className="mt-5 text-4xl font-light leading-[0.95] tracking-[-0.045em] sm:text-5xl">
              {category.label}
            </h2>

            <p className="mt-5 text-sm leading-7 text-black/50 sm:text-base">
              {category.description}
            </p>
          </div>

          <div className="space-y-6">
            {categoryServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                reverse={index % 2 === 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}