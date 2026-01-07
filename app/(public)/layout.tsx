import { Metadata } from 'next';
import { RootHeader, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: {
    default: 'ROZX',
    template: '%s | ROZX',
  },
  description: 'Digital Operating System for Indian Healthcare',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <RootHeader />
      {children}
      <Footer />
    </>
  )
}
