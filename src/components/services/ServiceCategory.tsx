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

export default function ServiceCategory({
  category,
  index,
}: ServiceCategoryProps) {
  const categoryServices = getServicesByCategory(category.id);

  return (
    <section
      id={category.id}
      className="border-t border-black/10 pb-20 pt-10 sm:pb-28 sm:pt-16 lg:pb-36 lg:pt-20"
    >
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        <div
          className={`lg:sticky lg:top-24 ${
            index % 2 !== 0 ? "lg:order-2" : ""
          }`}
        >
          <div className="relative h-52 overflow-hidden rounded-3xl bg-[#ddd7ca] sm:h-64 sm:rounded-4xl lg:h-72">
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
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/60">
                  {category.eyebrow}
                </p>

                <h3 className="mt-2 text-3xl font-light tracking-[-0.04em] text-white sm:text-4xl">
                  {category.label}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className={index % 2 !== 0 ? "lg:order-1" : ""}>
          <div className="mb-10 max-w-xl">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#80683c]">
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