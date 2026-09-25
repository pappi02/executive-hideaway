import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesHero from "@/components/services/ServicesHero";
import ServiceCategory from "@/components/services/ServiceCategory";
import { serviceCategories } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Explore grooming, massage, spa, facial, nail care, and wellness services at Executive Hideaway Barber and Spa in Nairobi.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main>
        <ServicesHero />

        <section
          id="services"
          className="bg-[#f3efe6] px-5 text-[#0b0b0a] sm:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">
            {/* Introduction */}
            <div className="py-8 sm:py-14 lg:py-18">
              <div className="max-w-3xl">
                <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#80683c]">
                  <span className="h-px w-8 bg-[#80683c]" />
                  The menu
                </p>

                <h2 className="mt-4 text-3xl font-light leading-[0.92] tracking-[-0.055em] sm:text-6xl lg:text-[6rem]">
                  Choose your
                  <br />
                  <span className="text-black/30">way to unwind.</span>
                </h2>


                {/* Category navigation */}
                <nav className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                  {serviceCategories.map((category) => (
                    <a
                      key={category.id}
                      href={`#${category.id}`}
                      className="flex min-w-0 items-center justify-center rounded-full border border-black/10 px-2 py-2 text-center text-[9px] font-semibold uppercase tracking-[0.12em] text-black/55 transition-all duration-300 hover:border-[#80683c]/40 hover:bg-[#80683c] hover:text-white sm:px-3 sm:tracking-[0.18em]"
                    >
                      {category.label}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            {/* Service categories */}
            {serviceCategories.map((category, index) => (
              <ServiceCategory
                key={category.id}
                category={category}
                index={index}
              />
            ))}

          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}