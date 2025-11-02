import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LightField Legal Practitioners",
  description: "Modern law firm specializing in emerging tech, AI, and blockchain law",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
