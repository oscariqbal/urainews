import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import Footer from '@/app/footer';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-title",
});

export const metadata: Metadata = {
  title: "Urainews",
  description: "Brings you the latest AI news headlines from multiple sources in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} antialiased leading-relaxed text-xs md:text-sm lg:text-base`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
