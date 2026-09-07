import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader, Caveat } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['500', '600'],
});

export const metadata: Metadata = {
  title: 'SkillBridge — National Education & Career Ecosystem Platform',
  description:
    'Bridging the gap between learning and the real world. SkillBridge connects students, industry and academia through verified skill telemetry and objective hiring pathways.',
  keywords: [
    'SkillBridge',
    'skill gap',
    'internship',
    'job matching',
    'AI career platform',
    'NAAC',
    'AICTE',
    'academia industry collaboration',
    'EdTech',
    'SIH 2026',
  ],
  authors: [{ name: 'SkillBridge Team' }],
  openGraph: {
    title: 'SkillBridge — National Education & Career Ecosystem Platform',
    description:
      'AI-powered skill intelligence and opportunity matching platform for students, industry, and academia.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${newsreader.variable} ${caveat.variable}`}>
      <body className="font-sans antialiased bg-[#FAFAF7] text-[#111827] min-h-screen">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: { borderRadius: '1rem', border: '1px solid rgba(226, 232, 240, 0.8)' },
          }}
        />
      </body>
    </html>
  );
}
