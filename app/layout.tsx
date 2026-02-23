import type { Metadata } from "next";
import { Geist, Geist_Mono, Philosopher } from "next/font/google";
import "./globals.css";
import  Navbar  from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const philosopher = Philosopher({
  variable: "--font-philosopher",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Travel with Moeen | Explore the World",
  description: "Book your next adventure with Moeen Travel. Luxury tours, breathtaking destinations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${philosopher.variable} antialiased selection:bg-indigo-100 selection:text-indigo-900`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <Toaster richColors />
      </body>
    </html>
  );
}
