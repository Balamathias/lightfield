'use client';

import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import TechNovaHero from './TechNovaHero';
import TechNovaAbout from './TechNovaAbout';
import TechNovaDetails from './TechNovaDetails';
import TechNovaCTA from './TechNovaCTA';

export default function TechNovaPageContent() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="dark bg-[#0a0a0b] text-white">
        <TechNovaHero />
        <TechNovaAbout />
        <TechNovaDetails />
        <TechNovaCTA />
      </div>
      <Footer />
    </main>
  );
}
