import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { DatabaseNotice } from "@/components/DatabaseNotice";

export const metadata: Metadata = {
  title: "Inspiration Library",
  description: "A personal space to curate imagery, bookmarks, and inspiration into boards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fcfcfc] text-neutral-900">
        <DatabaseNotice />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
