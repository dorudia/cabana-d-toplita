import Navigation from "../components/Navigation";
import {
  Geist,
  Geist_Mono,
  Lora,
  Bokor,
  Grechen_Fuemen,
  Great_Vibes,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import Providers from "../components/Provider";
import { getSettings } from "./lib/actions";
import { Toaster } from "../@/components/ui/sonner";

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const grechen = Grechen_Fuemen({
  variable: "--font-grechen",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bokor = Bokor({
  variable: "--font-bokor",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cabana D Toplita",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${greatVibes.variable} ${bokor.variable} ${grechen.variable} ${lora.variable} ${geistMono.variable} antialiased dark:bg-slate-900 `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navigation />
            <main className="mx-auto dark:bg:slate-900 text-slate-foreground ">
              {children}
            </main>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
