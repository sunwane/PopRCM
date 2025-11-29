import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceChecker from "@/services/ServiceChecker";

const geistInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "POPRCM",
  description: "POPRCM - Nền tảng gợi ý phim thông minh",
  icons: {
    icon: "/LogoIcon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Gọi ServiceChecker trên server
  const checked = await ServiceChecker.checkServiceAvailability();
  console.log("Service availability:", checked);

  return (
    <html lang="en">
      <body className={`${geistInter.variable} antialiased mx-auto max-w-[2000px]`}>
        {children}
      </body>
    </html>
  );
}
