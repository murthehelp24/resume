import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Attachai | Portfolio",
  description:
    "Fullstack Developer specializing in building high-performance, visually stunning web applications with a growth mindset.",
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
