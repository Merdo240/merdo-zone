import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Merdo Zone",
  description: "Full-Stack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
     <body className="min-h-full flex flex-col">
  <LanguageProvider>
    <Navbar />
    {children}
  </LanguageProvider>
</body>
    </html>
  );
}