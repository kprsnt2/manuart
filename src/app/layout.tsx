import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Navbar from "@/components/navbar";
import ChatWidget from "@/components/chat-widget";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Manu's Art World 🎨",
  description: "A magical showcase of Manu's drawings, paintings, and creative adventures — where art comes alive! 🖌️",
  openGraph: {
    title: "Manu's Art World 🎨",
    description: "A magical showcase of Manu's drawings, paintings, and creative adventures — where art comes alive! 🖌️",
    type: "website",
    siteName: "Manu's Art World",
  },
  twitter: {
    card: "summary_large_image",
    title: "Manu's Art World 🎨",
    description: "A magical showcase of Manu's drawings, paintings, and creative adventures",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} antialiased`}>
        <Navbar />
        {children}
        <ChatWidget />
        <Analytics />
      </body>
    </html>
  );
}
