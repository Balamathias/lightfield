'use client';

import { usePathname } from 'next/navigation';
import SoloChat from './SoloChat';

export default function SoloChatWrapper() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <SoloChat />;
}
