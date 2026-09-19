import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MouseEffect from "../components/MouseEffect";
import KafkaPuppet from "../components/KafkaPuppet";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Diyul Portfolio | Creative Showcase",
  description: "Personal branding & creative showcase — Photography, Video, Design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white">
        {/* Interactive Mouse Torch & Fluid Cursor */}
        <MouseEffect />
        <Navbar />
        <main className="flex-grow">{children}</main>
        {/* Interactive Kafka Puppet Widget */}
        <KafkaPuppet />
        <Footer />
      </body>
    </html>
  );
}
