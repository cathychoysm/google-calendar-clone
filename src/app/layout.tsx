import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";

const roboto = Roboto({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Google Calendar",
  description:
    "Learn how Google Calendar helps you stay on top of your plans - at home, at work and everywhere in between.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} text-slate-500`}>
        <Header />
        <main className="flex flex-row">
          <SideBar />
          {children}
        </main>
      </body>
    </html>
  );
}
