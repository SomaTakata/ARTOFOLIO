import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artofolio",
  description:
    " Artofolio is a portfolio service for engineers that beautifully showcases your projects,technical skills, and social media links—just like an art museum.",
  metadataBase: new URL("https://artofolio.vercel.app/"),
  appleWebApp: true,
  applicationName: "Artofolio",
  keywords: ["Artofolio", "Gallery", "Portfolio"],
  icons: [
    {
      url: "/museum.ico",
      sizes: "any",
      type: "image/x-icon",
    },
  ],
  openGraph: {
    title: "Artofolio",
    description:
      "Artofolio is a portfolio service for engineers that beautifully showcases your projects,technical skills, and social media links—just like an art museum.",
    images: [
      {
        url: "/hero.png",
      },
    ],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
