import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RapidAcq - AI-Powered Federal Acquisition Platform",
  description: "Transform federal acquisition with AI-powered tools for SOWs, market research, strategy, and compliance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
