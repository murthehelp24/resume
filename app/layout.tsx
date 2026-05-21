import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attachai Jumpahom — Fullstack Developer",
  description:
    "Portfolio of Attachai Jumpahom, a Fullstack Developer building efficient, scalable solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
