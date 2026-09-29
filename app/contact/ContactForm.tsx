"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function ContactForm() {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <div>
        <label className="mb-2 block text-sm text-white/70">
          {isArabic ? "الاسم" : "Name"}
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder={isArabic ? "اكتب اسمك" : "Enter your name"}
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/60"
        />
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-sm text-white/70">
          {isArabic ? "البريد الإلكتروني" : "Email"}
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder={
            isArabic
              ? "example@email.com"
              : "example@email.com"
          }
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/60"
        />
      </div>

      {/* Subject */}
      <div>
        <label className="mb-2 block text-sm text-white/70">
          {isArabic ? "الموضوع" : "Subject"}
        </label>

        <input
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder={
            isArabic
              ? "موضوع الرسالة"
              : "Message subject"
          }
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/60"
        />
      </div>

      {/* Message */}
      <div>
        <label className="mb-2 block text-sm text-white/70">
          {isArabic ? "الرسالة" : "Message"}
        </label>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={6}
          placeholder={
            isArabic
              ? "اكتب رسالتك هنا..."
              : "Write your message here..."
          }
          className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-[#009F94]/60"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-[#009F94] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#00b8aa] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading"
          ? isArabic
            ? "جاري الإرسال..."
            : "Sending..."
          : isArabic
            ? "إرسال الرسالة"
            : "Send Message"}
      </button>

      {/* Success */}
      {status === "success" && (
        <div className="rounded-xl border border-[#009F94]/20 bg-[#009F94]/5 px-4 py-3 text-sm text-[#009F94]">
          {isArabic
            ? "تم إرسال رسالتك بنجاح."
            : "Your message has been sent successfully."}
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {isArabic
            ? "حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى."
            : "Something went wrong while sending the message. Please try again."}
        </div>
      )}

    </form>
  );
}
