import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FILMFOLIO — Your Cinema. Your Collection. Your Story.",
  description:
    "An advanced multi-user movie collection management platform for discovering films, managing personal libraries, tracking diary entries, building custom collections, and connecting with cinema lovers.",
  keywords: ["movies", "cinema", "film collection", "watchlist", "movie diary", "reviews", "TMDB"],
  authors: [{ name: "Filmfolio Team" }],
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#101014",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-obsidian text-cinema-text antialiased selection:bg-gold/20 selection:text-gold-secondary">
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#1B1B21",
              border: "1px solid #34343A",
              color: "#F5F1E8",
            },
          }}
        />
      </body>
    </html>
  );
}
