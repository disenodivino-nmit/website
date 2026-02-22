import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tanNimbus = localFont({
  src: "../../public/fonts/tan-nimbus.otf",
  variable: "--font-tan-nimbus",
  display: "swap",
});

const clashGrotesk = localFont({
  src: "../../public/fonts/ClashGrotesk-Variable.ttf",
  variable: "--font-clash-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dise\u00f1o Divino \u2014 The UI/UX Club",
  description:
    "A student-run UI/UX design club crafting divine digital experiences.",
  icons: {
    icon: "/logos/Di. 4k.png",
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
        className={`${geistSans.variable} ${geistMono.variable} ${tanNimbus.variable} ${clashGrotesk.variable} antialiased bg-black text-white font-body`}
      >
        {children}
      </body>
    </html>
  );
}
