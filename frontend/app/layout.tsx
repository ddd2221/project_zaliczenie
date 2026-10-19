import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LocalPulse v2.0 | Next-Gen Event Discovery & Fast RSVP Platform',
  description:
    'High-concurrency Event Discovery, Reservation & Ticketing Engine engineered with Django 5 REST and Next.js 14 App Router.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-slate-100 min-h-screen flex flex-col selection:bg-primary-500/30 selection:text-white`}>
        <div className="fixed inset-0 glow-primary pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="w-full border-t border-card-border/60 py-6 text-center text-xs text-slate-500 glass-panel mt-12">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>&copy; {new Date().getFullYear()} LocalPulse v2.0 Platform. Built with Django 5 REST & Next.js 14.</p>
              <div className="flex items-center space-x-6 text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>PostgreSQL 16 ACID Engine</span>
                </span>
                <span>•</span>
                <span>JWT Stateless Rotation</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
