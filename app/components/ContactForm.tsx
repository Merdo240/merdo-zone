"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function ContactForm() {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          isArabic
            ? "تم إرسال الرسالة بنجاح!"
            : "Message sent successfully!"
        );

        form.reset();
      } else {
        alert(
          result.message ??
            (isArabic
              ? "فشل إرسال الرسالة."
              : "Failed to send message")
        );
      }
    } catch {
      alert(
        isArabic
          ? "حدث خطأ ما. حاول مرة أخرى."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm text-white/60">
          {isArabic ? "الاسم" : "Name"}
        </label>

        <input
          type="text"
          name="name"
          required
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/50"
          placeholder={isArabic ? "اسمك" : "Your name"}
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm text-white/60">
          {isArabic ? "البريد الإلكتروني" : "Email"}
        </label>

        <input
          type="email"
          name="email"
          required
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/50"
          placeholder="you@example.com"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="mb-2 block text-sm text-white/60">
          {isArabic ? "الموضوع" : "Subject"}
        </label>

        <input
          type="text"
          name="subject"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/50"
          placeholder={
            isArabic
              ? "ما هو موضوع الرسالة؟"
              : "What is this about?"
          }
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm text-white/60">
          {isArabic ? "الرسالة" : "Message"}
        </label>

        <textarea
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/50"
          placeholder={
            isArabic
              ? "اكتب رسالتك هنا..."
              : "Write your message..."
          }
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#009F94] px-6 py-3 font-medium text-black transition hover:bg-[#00b8aa] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? isArabic
            ? "جاري الإرسال..."
            : "Sending..."
          : isArabic
            ? "إرسال الرسالة"
            : "Send Message"}
      </button>

    </form>
  );
}
