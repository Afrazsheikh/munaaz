import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MUNAAZ | Everyday, Elevated Luxury Fashion",
  description: "Thoughtfully designed clothing for a life well lived. Premium everyday luxury fashion for India and the United States.",
  keywords: ["MUNAAZ", "luxury fashion", "linen clothing", "tailored trousers", "modern menswear", "women luxury wear"],
  openGraph: {
    title: "MUNAAZ | Everyday, Elevated",
    description: "Thoughtfully designed clothing for a life well lived.",
    type: "website",
    locale: "en_US",
    siteName: "MUNAAZ Atelier"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} antialiased`}>
      <body className="min-h-screen bg-[#FFF9F1] font-sans selection:bg-[#A85F43] selection:text-white">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
