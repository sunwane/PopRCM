import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const geistInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POPRCM",
  description: "POPRCM - Nền tảng gợi ý phim thông minh",
  icons: {
    icon: "/LogoIcon.png",
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
        className={`${geistInter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
