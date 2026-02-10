import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import { cn } from "@/lib/utils";
import { ShieldCheck, FolderOpen, PlusCircle } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vantage KYC Case Management",
  description: "Ardonagh Specialities KYC Case Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans antialiased",
          inter.className
        )}
      >
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
              <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                  <a className="flex items-center space-x-3 group" href="/">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Vantage KYC
                      </span>
                      <span className="text-xs text-muted-foreground">Ardonagh Specialities</span>
                    </div>
                  </a>

                  <nav className="hidden md:flex items-center space-x-1">
                    <a
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-50 text-blue-700 bg-blue-50/50"
                      href="/cases"
                    >
                      <FolderOpen className="h-4 w-4" />
                      All Cases
                    </a>
                    <a
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 text-gray-600"
                      href="/cases/new"
                    >
                      <PlusCircle className="h-4 w-4" />
                      New Case
                    </a>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-700">System Online</span>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 container py-6 bg-transparent">
              {children}
            </main>
            <footer className="border-t bg-white/50 backdrop-blur-sm">
              <div className="container py-4">
                <p className="text-center text-sm text-muted-foreground">
                  © 2025 Ardonagh Specialities. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
