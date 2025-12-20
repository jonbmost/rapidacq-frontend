import type { Metadata } from "next";
import "./globals.css";
import { publicSans, merriweather } from './fonts';

export const metadata: Metadata = {
  title: "RapidAcq - AI-Powered Federal Acquisition",
  description: "Transform federal acquisition with agile, AI-powered tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
