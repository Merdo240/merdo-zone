"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  function changeLanguage(newLanguage: "en" | "ar") {
    setLanguage(newLanguage);
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-lg border border-white/10 bg-white/[0.03] p-1 text-sm">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-md px-3 py-1.5 transition ${
          language === "en"
            ? "bg-[#009F94] text-black"
            : "text-white/40 hover:text-white"
        }`}
      >
        EN
      </button>

      <span className="px-1 text-white/10">|</span>

      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`rounded-md px-3 py-1.5 transition ${
          language === "ar"
            ? "bg-[#009F94] text-black"
            : "text-white/40 hover:text-white"
        }`}
      >
        AR
      </button>
    </div>
  );
}