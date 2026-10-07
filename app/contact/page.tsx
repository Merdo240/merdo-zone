import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import ContactForm from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();

  const language =
    cookieStore.get("language")?.value === "ar" ? "ar" : "en";

  const isArabic = language === "ar";

  return {
    title: isArabic ? "تواصل معي" : "Contact Me",

    description: isArabic
      ? "تواصل مع Merdo Zone لمناقشة مشروعك واحتياجاتك البرمجية."
      : "Get in touch with Merdo Zone to discuss your project and development needs.",

    alternates: {
      canonical: "/contact",
    },

    openGraph: {
      type: "website",
      url: "/contact",
      title: isArabic
        ? "تواصل معي | Merdo Zone"
        : "Contact Me | Merdo Zone",
      description: isArabic
        ? "تواصل مع Merdo Zone لمناقشة مشروعك واحتياجاتك البرمجية."
        : "Get in touch with Merdo Zone to discuss your project and development needs.",
      siteName: "Merdo Zone",
      images: [
        {
          url: "/images/og-image.jpeg",
          width: 1000,
          height: 562,
          alt: "Merdo Zone - Full-Stack Developer",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: isArabic
        ? "تواصل معي | Merdo Zone"
        : "Contact Me | Merdo Zone",
      description: isArabic
        ? "تواصل مع Merdo Zone لمناقشة مشروعك واحتياجاتك البرمجية."
        : "Get in touch with Merdo Zone to discuss your project and development needs.",
      images: ["/images/og-image.jpeg"],
    },
  };
}

export default async function ContactPage() {
  const cookieStore = await cookies();

  const language =
    cookieStore.get("language")?.value === "ar" ? "ar" : "en";

  const isArabic = language === "ar";

  const socialLinks = await prisma.socialLink.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#010000] px-6 pb-24 pt-32">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#009F94]/[0.07] blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* Header */}
        <header
          className={`mb-14 max-w-3xl ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`mb-5 flex items-center gap-3 ${
              isArabic ? "justify-end" : "justify-start"
            }`}
          >
            <span className="h-px w-8 bg-[#009F94]" />

            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#009F94]">
              {isArabic ? "ابدأ مشروعك" : "START A PROJECT"}
            </p>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {isArabic ? (
              <>
                لنبنِ شيئًا{" "}
                <span className="text-[#009F94]">مميزًا</span>
              </>
            ) : (
              <>
                Let&apos;s build something{" "}
                <span className="text-[#009F94]">great.</span>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
            {isArabic
              ? "لديك فكرة أو مشروع؟ أخبرني بالتفاصيل وسنتحدث عن أفضل طريقة لتحويلها إلى منتج رقمي متكامل."
              : "Have an idea or project in mind? Tell me about it and let’s discuss the best way to turn it into a complete digital product."}
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          {/* Left Information */}
          <aside className="space-y-6">
            {/* Intro Card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[#009F94]/10 blur-3xl"
              />

              <div className="relative">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#009F94]/20 bg-[#009F94]/10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-[#009F94]"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 11.5a8.38 8.38 0 0 1-9 8.3 9.4 9.4 0 0 1-4-.9L3 20l1.1-4.2A8.2 8.2 0 0 1 3 11.5a8.4 8.4 0 1 1 18 0Z"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold text-white">
                  {isArabic
                    ? "لنتحدث عن مشروعك"
                    : "Let’s talk about your project"}
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  {isArabic
                    ? "شارك فكرتك، أهدافك، والميزانية المتوقعة. كلما زادت التفاصيل، كان من الأسهل فهم احتياجات مشروعك."
                    : "Share your idea, goals, and expected budget. The more details you provide, the easier it is to understand your project needs."}
                </p>
              </div>
            </div>

            {/* What Happens */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                {isArabic ? "ماذا بعد؟" : "WHAT HAPPENS NEXT"}
              </h2>

              <div className="mt-6 space-y-5">
                {[
                  {
                    number: "01",
                    title: isArabic ? "مراجعة الطلب" : "Request review",
                    description: isArabic
                      ? "أراجع تفاصيل مشروعك واحتياجاتك."
                      : "I review your project details and requirements.",
                  },
                  {
                    number: "02",
                    title: isArabic
                      ? "مناقشة التفاصيل"
                      : "Discuss the details",
                    description: isArabic
                      ? "نتحدث عن الفكرة، المزايا، والاتجاه المناسب للمشروع."
                      : "We discuss the idea, features, and the right direction for the project.",
                  },
                  {
                    number: "03",
                    title: isArabic
                      ? "التصور والتنفيذ"
                      : "Plan & build",
                    description: isArabic
                      ? "بعد الاتفاق، نحدد الخطوات ونبدأ التنفيذ."
                      : "Once we agree, we define the next steps and start building.",
                  },
                ].map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <span className="shrink-0 pt-0.5 font-mono text-xs text-[#009F94]">
                      {step.number}
                    </span>

                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {step.title}
                      </h3>

                      <p className="mt-1 text-xs leading-6 text-white/40">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 md:p-7">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
                  {isArabic ? "طرق التواصل" : "CONNECT"}
                </h2>

                <div className="mt-5 grid gap-2">
                  {socialLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:border-[#009F94]/30 hover:bg-[#009F94]/[0.05]"
                    >
                      <div className="flex items-center gap-3">
                        {social.icon && (
                          <span className="text-sm text-white/50 transition-colors group-hover:text-[#009F94]">
                            {social.icon}
                          </span>
                        )}

                        <span className="text-sm text-white/60 transition-colors group-hover:text-white">
                          {social.platform}
                        </span>
                      </div>

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`h-4 w-4 text-white/20 transition-all group-hover:text-[#009F94] ${
                          isArabic
                            ? "rotate-180 group-hover:-translate-x-0.5"
                            : "group-hover:translate-x-0.5"
                        }`}
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14M13 6l6 6-6 6"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Contact Form */}
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20">
            {/* Top Accent */}
            <div
              aria-hidden="true"
              className="h-px w-full bg-gradient-to-r from-transparent via-[#009F94]/70 to-transparent"
            />

            <div className="p-6 md:p-9 lg:p-10">
              <div
                className={`mb-8 ${
                  isArabic ? "text-right" : "text-left"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009F94]">
                  {isArabic ? "تفاصيل المشروع" : "PROJECT DETAILS"}
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {isArabic
                    ? "أخبرني عن مشروعك"
                    : "Tell me about your project"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  {isArabic
                    ? "املأ النموذج وسأتواصل معك بعد مراجعة التفاصيل."
                    : "Fill out the form and I’ll get back to you after reviewing the details."}
                </p>
              </div>

              <ContactForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}