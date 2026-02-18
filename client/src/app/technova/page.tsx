import type { Metadata } from 'next';
import TechNovaPageContent from '@/components/technova/TechNovaPageContent';

export const metadata: Metadata = {
  title: 'TechNova Summit 2026 | LightField Legal Practitioners',
  description:
    'TechNova Summit 2026 — a free, one-day tech conference on March 14, 2026 in Abakaliki, Ebonyi State. Explore AI, blockchain, and emerging tech with innovators, legal minds, and government leaders. Featuring Balogun Sofiyullahi, Managing Partner at LightField Legal Practitioners.',
  keywords: [
    'TechNova Summit',
    'TechNova 2026',
    'tech conference Nigeria',
    'free tech conference',
    'AI conference',
    'blockchain conference',
    'Abakaliki tech event',
    'Ebonyi State',
    'LightField Legal',
    'emerging technology',
    'innovation summit',
  ],
  openGraph: {
    type: 'website',
    title: 'TechNova Summit 2026 | Free Tech Conference',
    description:
      'March 14, 2026 — Abakaliki, Ebonyi State. A free, one-day tech conference bringing together innovators, legal minds, and tech enthusiasts. Featuring Balogun Sofiyullahi of LightField Legal Practitioners.',
    url: '/technova',
    images: [
      {
        url: '/videos/technova-og.jpg',
        width: 1200,
        height: 630,
        alt: 'TechNova Summit 2026',
      },
    ],
    videos: [
      {
        url: '/videos/technova.mp4',
        type: 'video/mp4',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechNova Summit 2026 | Free Tech Conference',
    description:
      'March 14, 2026 — Abakaliki, Ebonyi State. A free tech conference bringing together innovators, legal minds, and tech enthusiasts.',
    images: ['/videos/technova-og.jpg'],
  },
};

export default function TechNovaPage() {
  return <TechNovaPageContent />;
}
