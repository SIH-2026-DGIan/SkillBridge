import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SkillBridge — Next-Gen AI Skill & Opportunity Platform',
  description:
    'Vibrant AI-powered skill intelligence, real-time job & internship matching, and placement ecosystem for students, industry, and institutions.',
  keywords: [
    'SkillBridge',
    'skill gap',
    'internship',
    'job matching',
    'AI career platform',
    'career intelligence',
    'academia industry collaboration',
    'EdTech',
  ],
  authors: [{ name: 'SkillBridge Team' }],
  openGraph: {
    title: 'SkillBridge — Next-Gen AI Skill & Opportunity Platform',
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
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#f8fafc] text-slate-900 min-h-screen">
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
