import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "The B2B Web Agency (UK and Nigeria) for High-Performance Websites | BIGFISH by Peno",
  description: "UK and Nigeria B2B web agency building and optimising high-performance websites for £10m+ companies. Better SEO, higher conversions, more qualified leads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={outfit.variable}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
