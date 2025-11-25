import { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FAQsPageContent from '@/components/public/FAQsPageContent';

export const metadata: Metadata = {
  title: 'FAQs | Lightfield Legal Practitioners',
  description: 'Find answers to frequently asked questions about Lightfield LP\'s legal services, technology law expertise, blockchain advisory, data privacy compliance, and more.',
  openGraph: {
    title: 'FAQs | Lightfield Legal Practitioners',
    description: 'Find answers to frequently asked questions about Lightfield LP\'s legal services, technology law expertise, blockchain advisory, data privacy compliance, and more.',
  },
};

export default function FAQsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <FAQsPageContent />
      <Footer />
    </main>
  );
}
