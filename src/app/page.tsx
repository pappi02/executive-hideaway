import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AccommodationPreview from "@/components/home/AccommodationPreview";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <AccommodationPreview />
      <Gallery />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
