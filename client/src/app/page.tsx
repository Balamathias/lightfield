import Navbar from '@/components/public/Navbar';
import HeroSection from '@/components/public/HeroSection';
import FeaturesSection from '@/components/public/FeaturesSection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import TeamSection from '@/components/public/TeamSection';
import Footer from '@/components/public/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <TeamSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}