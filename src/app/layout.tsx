import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Sedan, Playfair_Display } from "next/font/google";
import Header from "~/components/Header";
import { ThemeProvider } from "~/components/ThemeProvider";
import "~/styles/globals.css";

const sedan = Sedan({
  subsets: ["latin"],
  variable: "--font-sedan",
  weight: "400",
  style: ["normal", "italic"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "João Vitor Dadas",
  description: "Brazilian software engineer",
  openGraph: {
    title: "João Vitor Dadas",
    description: "Brazilian software engineer",
    type: "website",
    url: "https://www.joaodadas.com.br",
    siteName: "João Vitor Dadas",
    images: ["https://www.joaodadas.com.br/api/og"],
  },
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sedan.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <Analytics />
          <main className="mx-auto max-w-[712px] px-4 md:py-10 min-h-[calc(100vh-50px-100px)] mb-10">
            <Header />
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
