import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import RoleSwitcher from "@/components/shared/RoleSwitcher";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces"
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "Quikdraw — 15-minute design bookings",
  description:
    "Book a designer for a 15-minute UI, website redesign, or Photoshop slot. Tip the work you love."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans bg-canvas">
        <RoleSwitcher />
        {children}
      </body>
    </html>
  );
}

