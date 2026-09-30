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
      ? "تواصل مع Merdo Zone عبر البريد الإلكتروني ووسائل التواصل المختلفة."
      : "Get in touch with Merdo Zone through email and social media.",

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
        ? "تواصل مع Merdo Zone عبر البريد الإلكتروني ووسائل التواصل المختلفة."
        : "Get in touch with Merdo Zone through email and social media.",
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
        ? "تواصل مع Merdo Zone عبر البريد الإلكتروني ووسائل التواصل المختلفة."
        : "Get in touch with Merdo Zone through email and social media.",
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
    <main className="min-h-screen bg-[#010000] px-6 pb-24 pt-32">
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 text-sm font-medium tracking-[0.25em] text-[#009F94]">
            {isArabic ? "تواصل معي" : "CONTACT ME"}
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {isArabic ? "تواصل معي" : "Contact Me"}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            {isArabic
              ? "أرسل لي رسالة وسأكون سعيدًا بالتواصل معك."
              : "Send me a message and I’ll be happy to get in touch."}
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">

          {/* Social Links */}
          <div>
            <h2 className="mb-5 text-xl font-semibold text-white">
              {isArabic ? "طرق التواصل" : "Connect With Me"}
            </h2>

            <div className="space-y-3">
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition hover:border-[#009F94]/30 hover:bg-white/[0.05] hover:text-[#009F94]"
                >
                  {social.icon && (
                    <span className="text-base">
                      {social.icon}
                    </span>
                  )}

                  <span>{social.platform}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <ContactForm />
          </div>

        </div>
      </div>
    </main>
  );
}
