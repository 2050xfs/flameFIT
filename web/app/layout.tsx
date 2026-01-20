import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "FlameFit - AI Powered Fitness",
  description: "Your simple, intelligent fitness companion.",
};

import { ShellWrapper } from "@/components/shell/ShellWrapper";
import { QueryProvider } from "@/lib/providers/QueryProvider";

// ... existing imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <QueryProvider>
          <ShellWrapper>
            {children}
          </ShellWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
