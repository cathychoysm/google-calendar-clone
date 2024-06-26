import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Google Calendar (Clone)",
  description:
    "Learn how Google Calendar (Clone) helps you stay on top of your plans - at home, at work and everywhere in between.",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "Google Calendar (Clone)",
    description:
      "Learn how Google Calendar (Clone) helps you stay on top of your plans - at home, at work and everywhere in between.",
    images: "/preview.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} text-slate-600`}>{children}</body>
    </html>
  );
}
