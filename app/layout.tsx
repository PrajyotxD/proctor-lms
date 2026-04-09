import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Shield } from "lucide-react";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProctorAI LMS - Secure AI-Powered Exam Proctoring",
  description: "Enterprise-grade exam integrity platform with real-time AI monitoring and analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <AppProviders>
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 p-4 md:p-8">
            {/* Modern Header with Glassmorphism */}
            <header className="glass-strong sticky top-4 z-50 flex items-center justify-between rounded-2xl px-6 py-4 shadow-lg">
              <Link href="/" className="group flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-lg transition-transform group-hover:scale-105 group-hover:shadow-glow">
                  <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-foreground">
                    Proctor<span className="gradient-text">AI</span>
                  </span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Enterprise LMS
                  </span>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/signin">
                  <button className="rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:border-primary/50 hover:bg-secondary/80 active:scale-[0.98]">
                    Sign in
                  </button>
                </Link>
                <ThemeToggle />
              </div>
            </header>
            <main>{children}</main>
            
            {/* Footer */}
            <footer className="mt-12 border-t border-border pt-8 pb-4">
              <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                <p className="text-sm text-muted-foreground">
                  © 2026 ProctorAI. Enterprise exam integrity platform.
                </p>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <span>Powered by Next.js 16</span>
                  <span>•</span>
                  <span>Firebase</span>
                  <span>•</span>
                  <span>TensorFlow.js</span>
                </div>
              </div>
            </footer>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
