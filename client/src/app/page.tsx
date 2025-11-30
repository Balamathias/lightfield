import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import FeaturesSection from '@/components/public/FeaturesSection';
import GrantsSection from '@/components/public/GrantsSection';
import BlogsSection from '@/components/public/BlogsSection';
import TeamSection from '@/components/public/TeamSection';
import PartnersSection from '@/components/public/PartnersSection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import FAQSection from '@/components/public/FAQSection';
import Footer from '@/components/public/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <GrantsSection />
      <BlogsSection />
      <TeamSection />
      <PartnersSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
