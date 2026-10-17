import type {Metadata} from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Barish & Brew — Artisanal Chai & Bakery House',
  description: 'Interactive 3D monsoon scrollytelling experience for Barish & Brew, featuring a wipeable rain-fogged window, Three.js PBR cutting chai pour, orbiting bakery biscuits, and live ordering.',
  openGraph: {
    title: 'Barish & Brew — Artisanal Chai & Bakery House',
    description: 'Interactive 3D monsoon scrollytelling experience for Barish & Brew, featuring a wipeable rain-fogged window, Three.js PBR cutting chai pour, orbiting bakery biscuits, and live ordering.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Barish & Brew — Artisanal Chai & Bakery House',
    description: 'Interactive 3D monsoon scrollytelling experience for Barish & Brew, featuring a wipeable rain-fogged window, Three.js PBR cutting chai pour, orbiting bakery biscuits, and live ordering.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${jetbrains.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="bg-[#120D0A] text-[#F7EFE4] antialiased selection:bg-[#C86D2D] selection:text-white">
        {children}
      </body>
    </html>
  );
}
