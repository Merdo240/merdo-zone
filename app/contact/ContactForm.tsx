"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/app/components/LanguageProvider";

export default function ContactForm() {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
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
          phone,
          service,
          budget,
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
      setPhone("");
      setService("");
      setBudget("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 hover:border-white/15 focus:border-[#009F94]/60 focus:bg-white/[0.045]";

  const labelClass =
    "mb-2 block text-sm font-medium text-white/70";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Intro */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-white">
          {isArabic ? "ابدأ مشروعك" : "Start Your Project"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/40">
          {isArabic
            ? "أخبرني عن مشروعك وسأتواصل معك لمناقشة التفاصيل."
            : "Tell me about your project and I’ll get in touch to discuss the details."}
        </p>
      </div>

      {/* Name + Phone */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            {isArabic ? "الاسم الكامل" : "Full Name"}
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
            placeholder={
              isArabic ? "اكتب اسمك الكامل" : "Enter your full name"
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            {isArabic ? "رقم الهاتف" : "Phone Number"}
            <span className="ms-2 text-xs text-white/25">
              {isArabic ? "اختياري" : "Optional"}
            </span>
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            placeholder={
              isArabic ? "+967 7X XXX XXXX" : "+967 7X XXX XXXX"
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>
          {isArabic ? "البريد الإلكتروني" : "Email Address"}
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="example@email.com"
          className={inputClass}
        />
      </div>

      {/* Service + Budget */}
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            {isArabic ? "نوع الخدمة" : "Service"}
          </label>

          <select
            value={service}
            onChange={(event) => setService(event.target.value)}
            required
            className={`${inputClass} appearance-none`}
          >
            <option value="" disabled className="bg-[#111]">
              {isArabic ? "اختر نوع الخدمة" : "Select a service"}
            </option>

            <option value="Website" className="bg-[#111]">
              {isArabic ? "موقع إلكتروني" : "Website"}
            </option>

            <option value="E-commerce" className="bg-[#111]">
              {isArabic ? "متجر إلكتروني" : "E-commerce"}
            </option>

            <option value="Web Application" className="bg-[#111]">
              {isArabic ? "تطبيق ويب" : "Web Application"}
            </option>

            <option value="Custom System" className="bg-[#111]">
              {isArabic ? "نظام مخصص" : "Custom System"}
            </option>

            <option value="UI/UX Design" className="bg-[#111]">
              {isArabic ? "تصميم UI/UX" : "UI/UX Design"}
            </option>

            <option value="Other" className="bg-[#111]">
              {isArabic ? "أخرى" : "Other"}
            </option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            {isArabic ? "الميزانية المتوقعة" : "Expected Budget"}
            <span className="ms-2 text-xs text-white/25">
              {isArabic ? "اختياري" : "Optional"}
            </span>
          </label>

          <select
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="" className="bg-[#111]">
              {isArabic ? "اختر الميزانية" : "Select a budget"}
            </option>

            <option value="Less than $100" className="bg-[#111]">
              {isArabic ? "أقل من $100" : "Less than $100"}
            </option>

            <option value="$100 – $300" className="bg-[#111]">
              $100 – $300
            </option>

            <option value="$300 – $500" className="bg-[#111]">
              $300 – $500
            </option>

            <option value="$500 – $1,000" className="bg-[#111]">
              $500 – $1,000
            </option>

            <option value="$1,000+" className="bg-[#111]">
              $1,000+
            </option>

            <option value="Not sure yet" className="bg-[#111]">
              {isArabic ? "غير محددة حاليًا" : "Not sure yet"}
            </option>
          </select>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className={labelClass}>
          {isArabic ? "موضوع المشروع" : "Project Subject"}
        </label>

        <input
          type="text"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          required
          placeholder={
            isArabic
              ? "مثال: إنشاء متجر إلكتروني"
              : "e.g. E-commerce website development"
          }
          className={inputClass}
        />
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>
          {isArabic ? "تفاصيل المشروع" : "Project Details"}
        </label>

        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          rows={7}
          placeholder={
            isArabic
              ? "اكتب فكرتك، المتطلبات، المميزات التي تحتاجها، وأي تفاصيل أخرى تساعدني على فهم المشروع..."
              : "Tell me about your idea, requirements, features you need, and anything else that can help me understand the project..."
          }
          className={`${inputClass} resize-none leading-7`}
        />

        <p className="mt-2 text-xs text-white/25">
          {isArabic
            ? "كلما زادت التفاصيل، كان من الأسهل فهم احتياجك."
            : "The more details you provide, the easier it is to understand your needs."}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#009F94] px-6 py-3.5 text-sm font-semibold text-black transition duration-300 hover:bg-[#00b8aa] hover:shadow-[0_0_30px_rgba(0,159,148,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            {isArabic ? "جاري الإرسال..." : "Sending..."}
          </>
        ) : (
          <>
            {isArabic ? "إرسال طلب المشروع" : "Send Project Inquiry"}
            <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
              {isArabic ? "←" : "→"}
            </span>
          </>
        )}
      </button>

      {/* Success */}
      {status === "success" && (
        <div className="rounded-xl border border-[#009F94]/20 bg-[#009F94]/5 px-4 py-3.5 text-sm text-[#009F94]">
          {isArabic
            ? "تم إرسال طلبك بنجاح. سأراجع التفاصيل وأتواصل معك قريبًا."
            : "Your inquiry has been sent successfully. I’ll review the details and get back to you soon."}
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm text-red-400">
          {isArabic
            ? "حدث خطأ أثناء إرسال الطلب. تأكد من البيانات وحاول مرة أخرى."
            : "Something went wrong while sending your inquiry. Please check your details and try again."}
        </div>
      )}
    </form>
  );
}