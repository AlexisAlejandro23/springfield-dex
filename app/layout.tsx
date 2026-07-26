import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const simpsonFont = localFont({
  src: "./fonts/simpsons.otf",
  variable: "--font-simpsons",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configuración de Viewport y ThemeColor
export const viewport: Viewport = {
  themeColor: "#fed90f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"), // Mantén esto para evitar la otra advertencia

  title: {
    default: "Springfield Dex | Tu enciclopedia personal",
    template: "%s | Springfield Dex",
  },
  description: "Explora las locaciones más icónicas de Springfield...",
  
  keywords: ["Los Simpson", "Springfield", "Next.js"],
  authors: [{ name: "Tu Nombre" }],
  creator: "Tu Nombre",

  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "http://localhost:3000",
    title: "Springfield Dex | Tu enciclopedia personal de Springfield",
    description: "Recrea los momentos más icónicos de Springfield...",
    siteName: "Springfield Dex",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "Springfield Dex Preview",
    //   },
    // ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Springfield Dex | Tu enciclopedia personal",
    description: "Explora Springfield con este widget interactivo y retro.",
    // images: ["/og-image.png"], 
  },

  robots: {
    index: true,
    follow: true,
    // ...
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${simpsonFont.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}