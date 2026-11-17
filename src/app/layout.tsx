import type { Metadata } from 'next';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout';

export const metadata: Metadata = {
  title: 'YoLearn.ai — Question Bank Management System',
  description:
    'Centralized, AI-powered question repository for K-12, CBSE, ICSE, JEE Main, JEE Advanced, NEET, and CUET examinations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-slate-900 bg-slate-50 antialiased selection:bg-indigo-500 selection:text-white">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
