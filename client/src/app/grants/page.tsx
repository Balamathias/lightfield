import { Metadata } from 'next';
import GrantsPageContent from './GrantsPageContent';

export const metadata: Metadata = {
  title: 'Grants & Scholarships | LightField Legal Practitioners',
  description: 'Explore grants, scholarships, and awards offered by LightField LP to support aspiring legal professionals and students in Nigeria.',
  openGraph: {
    title: 'Grants & Scholarships | LightField Legal Practitioners',
    description: 'Explore grants, scholarships, and awards offered by LightField LP to support aspiring legal professionals and students in Nigeria.',
    type: 'website',
  },
};

export default function GrantsPage() {
  return <GrantsPageContent />;
}
