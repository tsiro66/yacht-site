import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "block",
});

const googleSans = localFont({
  src: "./fonts/GoogleSans-Medium.ttf",
  variable: "--font-google-sans",
  weight: "500",
  display: "block",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "block",
});

export const metadata: Metadata = {
  title: "Yacht",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable} ${googleSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-hero">{children}</body>
    </html>
  );
}
