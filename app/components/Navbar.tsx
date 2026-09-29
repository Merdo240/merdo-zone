"use client";

import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

export default function Navbar() {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#010000]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition hover:text-[#009F94]"
        >
          Merdo Zone
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            href="/"
            className="text-sm text-white/50 transition hover:text-white"
          >
            {isArabic ? "الرئيسية" : "Home"}
          </Link>

          <Link
            href="/projects"
            className="text-sm text-white/50 transition hover:text-white"
          >
            {isArabic ? "المشاريع" : "Projects"}
          </Link>

          <Link
            href="/contact"
            className="text-sm text-white/50 transition hover:text-white"
          >
            {isArabic ? "التواصل" : "Contact"}
          </Link>

        </div>

        {/* Language */}
        <LanguageSwitcher />

      </nav>
    </header>
  );
}