import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import Leisure from "@/components/home/Leisure";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import AccommodationPreview from "@/components/home/AccommodationPreview";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/layout/Footer";

// Cached and served from the CDN; refreshed hourly, and immediately when the
// admin dashboard saves a change (revalidatePath in the admin actions).
export const revalidate = 3600;

export default async function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Leisure />
      <AccommodationPreview />
      <Gallery />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
