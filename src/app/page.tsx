import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Experience from "@/components/home/Experience";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Gallery from "@/components/home/Gallery";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Gallery />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
