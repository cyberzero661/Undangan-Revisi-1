import HeroSection from "@/components/landing/HeroSection";
import TemplateShowcase from "@/components/landing/TemplateShowcase";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TemplateShowcase />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
