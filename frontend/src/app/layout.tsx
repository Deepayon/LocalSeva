import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "../components/ui/toaster";
import Navbar from "../components/navbar";
import BottomNav from "../components/bottom-nav";
import Footer from "../components/footer";
import { AuthProvider } from "../context/auth-context";
import AuthSync from "../components/auth-sync";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

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
        className="font-sans antialiased bg-background text-foreground"
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
