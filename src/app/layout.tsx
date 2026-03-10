import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Kenya Hardware Pro (HPro) | POS Hub",
  description: "Enterprise hardware management with eTIMS & M-Pesa integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={cn(
        inter.variable,
        outfit.variable,
        "antialiased flex h-screen overflow-hidden bg-slate-950 text-slate-50"
      )}>
        <Sidebar aria-label="Main Navigation" />
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-10 transition-all duration-300 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
