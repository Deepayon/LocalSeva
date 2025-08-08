import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/navbar";
import BottomNav from "@/components/bottom-nav";
import Footer from "@/components/footer";
import { AuthProvider } from "@/contexts/auth-context";
import AuthSync from "@/components/auth-sync";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalSeva - Hyperlocal Community Service Exchange",
  description: "Connect with your neighborhood for water schedules, power alerts, skill exchange, lost & found, and parking services.",
  keywords: ["LocalSeva", "community", "neighborhood", "services", "India", "hyperlocal"],
  authors: [{ name: "LocalSeva Team" }],
  openGraph: {
    title: "LocalSeva - Community Service Exchange",
    description: "Hyperlocal platform for Indian neighborhoods to share services and information",
    url: "https://localseva.app",
    siteName: "LocalSeva",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalSeva - Community Service Exchange",
    description: "Hyperlocal platform for Indian neighborhoods",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <AuthSync />
          <Navbar />
          <main className="min-h-screen pb-16 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
