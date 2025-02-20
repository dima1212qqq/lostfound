import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CitySelectionGuard } from "./component/CitySelectionGuard";
import MobileFAB from "./component/MobileFAB";
import { SpeedInsights } from '@vercel/speed-insights/next';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lost&Found",
  description: "Поиск животных, личных вещей и прочего прочего",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SpeedInsights />
        <CitySelectionGuard>{children}</CitySelectionGuard>
        <MobileFAB />
      </body>
    </html>
  );
}

