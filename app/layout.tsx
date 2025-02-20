import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CitySelectionGuard } from "./component/CitySelectionGuard";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileFAB from "./component/MobileFAB";

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
          <CitySelectionGuard>{children}</CitySelectionGuard>
          <MobileFAB />
      </body>
    </html>
  );
}

