import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, Sedan, Playfair_Display } from "next/font/google";
import Header from "~/components/Header";
import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
      className={`${inter.variable} ${sedan.variable} ${playfairDisplay.variable}`}
    >
      <body>
        <Analytics />
        <main className="mx-auto max-w-[712px] px-4 md:py-10 min-h-[calc(100vh-50px-100px)] mb-10">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
