import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceChecker from "@/services/ServiceChecker";
import { AuthProvider } from "@/providers/AuthProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ClientLayout } from "@/components/layout/ClientLayout";

const geistInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "POPRCM",
  description: "POPRCM - Nền tảng gợi ý phim thông minh",
  icons: {
    icon: "/logoicon.png",
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

  // Lấy Google Client ID từ environment
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en">
      <body className={`${geistInter.variable} antialiased mx-auto max-w-[2000px]`}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
