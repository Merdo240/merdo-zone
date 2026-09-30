import type { Metadata } from "next";
import { prisma } from "@/src/lib/prisma";
import ContactForm from "@/app/components/ContactForm";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.profile.findFirst({
    include: {
      translations: true,
    },
  });

  const translation =
    profile?.translations.find(
      (item) => item.languageCode === "en"
    ) ?? profile?.translations[0];

  const title =
    translation?.jobTitle
      ? `${profile?.brandName ?? "Merdo Zone"} | ${translation.jobTitle}`
      : "Merdo Zone | Full-Stack Developer";

  const description =
    translation?.heroDescription ??
    translation?.shortBio ??
    "Merdo Zone is the personal portfolio of a Full-Stack Developer, showcasing projects, technologies, and software development work.";

  return {
    title,

    description,

    alternates: {
      canonical: "/",
    },

    openGraph: {
      type: "website",
      url: "/",
      title,
      description,
      siteName: profile?.brandName ?? "Merdo Zone",
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
      title,
      description,
      images: ["/images/og-image.jpeg"],
    },
  };
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Merdo Zone",
    url: "https://merdo-zone.vercel.app",
    jobTitle: "Full-Stack Developer",
    description:
      "Full-Stack Developer portfolio showcasing projects, technologies, and software development work.",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Merdo Zone",
    url: "https://merdo-zone.vercel.app",
    description:
      "Merdo Zone is the personal portfolio of a Full-Stack Developer, showcasing projects, technologies, and software development work.",
  },
];

export default async function Home() {
  const cookieStore = await cookies();

  const language =
    cookieStore.get("language")?.value === "ar" ? "ar" : "en";

  function getTranslation<T extends { languageCode: string }>(
    translations: T[]
  ) {
    return (
      translations.find((item) => item.languageCode === language) ??
      translations.find((item) => item.languageCode === "en") ??
      translations[0]
    );
  }

  const profile = await prisma.profile.findFirst({
    include: {
      translations: true,
    },
  });

  const technologyCategories =
    await prisma.technologyCategory.findMany({
      where: {
        isVisible: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
      include: {
        translations: true,
        technologies: {
          where: {
            isVisible: true,
          },
          orderBy: {
            displayOrder: "asc",
          },
          include: {
            translations: true,
          },
        },
      },
    });

  const featuredProjects = await prisma.project.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
    take: 3,
    include: {
      translations: true,
      technologies: {
        orderBy: {
          displayOrder: "asc",
        },
        include: {
          technology: {
            include: {
              translations: true,
            },
          },
        },
      },
    },
  });

  const educationItems = await prisma.education.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
    },
  });

  const experienceItems = await prisma.experience.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
    },
  });

  const resumes = await prisma.resume.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const socialLinks = await prisma.socialLink.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  const translation =
    profile?.translations.find(
      (item) => item.languageCode === language
    ) ??
    profile?.translations.find(
      (item) => item.languageCode === "en"
    ) ??
    profile?.translations[0];

  return (
    <main className="min-h-screen bg-[#010000] text-white">
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd),
  }}
/>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#009F94 1px, transparent 1px), linear-gradient(90deg, #009F94 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#009F94]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.35em] text-[#009F94]">
            {profile?.brandName ?? "Merdo Zone"}
          </p>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            {translation?.heroTitle ?? "Full-Stack Developer"}
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
            {translation?.heroDescription ??
              translation?.shortBio ??
              "I build modern applications, backend systems, and digital experiences."}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/projects"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[#009F94] px-7 font-medium text-black transition hover:bg-[#00b8aa] sm:w-auto"
            >
              {language === "ar" ? "عرض المشاريع" : "View Projects"}
            </a>

            <a
              href="/contact"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-white/10 px-7 font-medium text-white transition hover:border-[#009F94]/50 hover:bg-[#009F94]/10 sm:w-auto"
            >
              {language === "ar" ? "تواصل معي" : "Contact Me"}
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-3 text-xs text-white/30">
            <span className="h-px w-10 bg-white/10" />
            <span>BUILD · LEARN · CREATE</span>
            <span className="h-px w-10 bg-white/10" />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-10">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "عني" : "About Me"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar" ? "من أنا" : "Who I Am"}
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="whitespace-pre-line text-base leading-8 text-white/60 sm:text-lg">
              {translation?.about ??
                "I am a Full-Stack Developer passionate about building modern applications and reliable backend systems."}
            </p>
          </div>
        </div>
      </section>

      {/* What I Build */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "ماذا أبني" : "What I Build"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar"
                ? "أحوّل الأفكار إلى أنظمة"
                : "Turning Ideas Into Systems"}
            </h2>

            <p className="mt-4 max-w-2xl text-white/50">
              {language === "ar"
                ? "أركز على بناء حلول رقمية عملية عبر طبقات الواجهة الأمامية والخلفية وقواعد البيانات."
                : "I focus on building practical digital solutions across the frontend, backend, and database layers."}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:-translate-y-1 hover:border-[#009F94]/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#009F94]/20 bg-[#009F94]/10 text-[#009F94]">
                01
              </div>

              <h3 className="text-xl font-semibold">
                {language === "ar"
                  ? "تطوير Backend"
                  : "Backend Development"}
              </h3>

              <p className="mt-3 leading-7 text-white/50">
                {language === "ar"
                  ? "بناء APIs وأنظمة المصادقة ومنطق الأعمال والتطبيقات الموثوقة من جهة الخادم."
                  : "Building APIs, authentication systems, business logic, and reliable server-side applications."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:-translate-y-1 hover:border-[#009F94]/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#009F94]/20 bg-[#009F94]/10 text-[#009F94]">
                02
              </div>

              <h3 className="text-xl font-semibold">
                {language === "ar"
                  ? "تطبيقات الويب"
                  : "Web Applications"}
              </h3>

              <p className="mt-3 leading-7 text-white/50">
                {language === "ar"
                  ? "تطوير تطبيقات Full-Stack حديثة بواجهات نظيفة ومتجاوبة وتجارب استخدام عملية."
                  : "Developing modern full-stack applications with clean, responsive, and practical user experiences."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:-translate-y-1 hover:border-[#009F94]/40">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-[#009F94]/20 bg-[#009F94]/10 text-[#009F94]">
                03
              </div>

              <h3 className="text-xl font-semibold">
                {language === "ar"
                  ? "قواعد البيانات والأنظمة"
                  : "Databases & Systems"}
              </h3>

              <p className="mt-3 leading-7 text-white/50">
                {language === "ar"
                  ? "تصميم قواعد البيانات ونماذج البيانات وهندسة التطبيقات للاستخدام الواقعي."
                  : "Designing structured databases, data models, and application architectures built for real-world use."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "التقنيات" : "Technologies"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar"
                ? "الأدوات التي أعمل بها"
                : "Tools I Work With"}
            </h2>

            <p className="mt-4 max-w-2xl text-white/50">
              {language === "ar"
                ? "التقنيات والأدوات التي أستخدمها لبناء التطبيقات وأنظمة Backend والحلول الرقمية."
                : "Technologies and tools I use to build applications, backend systems, and digital solutions."}
            </p>
          </div>

          <div className="space-y-10">
            {technologyCategories.map((category) => {
              const categoryTranslation =
                getTranslation(category.translations);

              return (
                <div key={category.id}>
                  <div className="mb-5">
                    <h3 className="text-xl font-semibold">
                      {categoryTranslation?.name}
                    </h3>

                    {categoryTranslation?.description && (
                      <p className="mt-1 text-sm text-white/40">
                        {categoryTranslation.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {category.technologies.map((technology) => {
                      const technologyTranslation =
                        getTranslation(technology.translations);

                      return (
                        <div
                          key={technology.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:-translate-y-1 hover:border-[#009F94]/40"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {technology.icon ? (
                                <img
                                  src={technology.icon}
                                  alt=""
                                  className="h-10 w-10 object-contain"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#009F94]/20 bg-[#009F94]/10 text-sm font-bold text-[#009F94]">
                                  {technologyTranslation?.name?.charAt(0)}
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold">
                                  {technologyTranslation?.name}
                                </h4>

                                {technologyTranslation?.description && (
                                  <p className="mt-1 text-xs text-white/40">
                                    {technologyTranslation.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between">
                            <span className="text-xs uppercase tracking-wider text-white/30">
                              {language === "ar"
                                ? "الخبرة"
                                : "Experience"}
                            </span>

                            <span
                              className="tracking-[0.2em] text-sm text-[#009F94]"
                              aria-label={`Experience level ${technology.experienceLevel} out of 5`}
                            >
                              {"★".repeat(
                                technology.experienceLevel
                              )}

                              <span className="text-white/10">
                                {"★".repeat(
                                  5 - technology.experienceLevel
                                )}
                              </span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
                {language === "ar"
                  ? "مشاريع مميزة"
                  : "Featured Projects"}
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                {language === "ar"
                  ? "أشياء قمت ببنائها"
                  : "Things I've Built"}
              </h2>

              <p className="mt-4 max-w-2xl text-white/50">
                {language === "ar"
                  ? "مجموعة من المشاريع الشخصية والأكاديمية التي بنيتها أثناء تعلمي وتطوير مهاراتي."
                  : "A selection of personal and academic projects built while learning and developing my skills."}
              </p>
            </div>

            <a
              href="/projects"
              className="text-sm font-medium text-[#009F94] transition hover:text-white"
            >
              {language === "ar"
                ? "عرض جميع المشاريع ←"
                : "View All Projects →"}
            </a>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => {
              const projectTranslation =
                getTranslation(project.translations);

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:-translate-y-1 hover:border-[#009F94]/40"
                >
                  <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-white/5">
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={
                          projectTranslation?.name ?? "Project"
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/20">
                        {language === "ar"
                          ? "لا توجد صورة"
                          : "No Cover Image"}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold">
                      {projectTranslation?.name}
                    </h3>

                    {projectTranslation?.shortDescription && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                        {projectTranslation.shortDescription}
                      </p>
                    )}

                    {project.technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map((item) => {
                          const technologyTranslation =
                            getTranslation(
                              item.technology.translations
                            );

                          return (
                            <span
                              key={item.technologyId}
                              className="rounded-lg border border-[#009F94]/20 bg-[#009F94]/5 px-2.5 py-1 text-xs text-[#009F94]"
                            >
                              {technologyTranslation?.name}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-6 flex gap-3">
                      <a
                        href={`/projects/${project.slug}`}
                        className="flex-1 rounded-lg bg-[#009F94] px-4 py-2.5 text-center text-sm font-medium text-black transition hover:bg-[#00b8aa]"
                      >
                        {language === "ar"
                          ? "التفاصيل"
                          : "Details"}
                      </a>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm transition hover:border-[#009F94]/40 hover:bg-[#009F94]/10"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "التعليم" : "Education"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar"
                ? "مسيرتي التعليمية"
                : "My Education"}
            </h2>
          </div>

          {educationItems.length === 0 ? (
            <p className="text-white/40">
              {language === "ar"
                ? "لا توجد معلومات تعليمية متاحة حاليًا."
                : "No education information available yet."}
            </p>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />

              <div className="space-y-10">
                {educationItems.map((item) => {
                  const translation = getTranslation(
                    item.translations
                  );

                  return (
                    <div
                      key={item.id}
                      className="relative pl-10"
                    >
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-[#009F94] bg-[#010000]" />

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#009F94]/30">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-xl font-semibold">
                            {translation?.title ??
                              (language === "ar"
                                ? "التعليم"
                                : "Education")}
                          </h3>

                          <span className="text-sm text-[#009F94]">
                            {item.isCurrent
                              ? language === "ar"
                                ? "حتى الآن"
                                : "Present"
                              : item.endDate
                                ? new Date(
                                    item.endDate
                                  ).getFullYear()
                                : ""}
                          </span>
                        </div>

                        {item.startDate && (
                          <p className="mt-2 text-sm text-white/30">
                            {new Date(
                              item.startDate
                            ).getFullYear()}
                            {" — "}
                            {item.isCurrent
                              ? language === "ar"
                                ? "حتى الآن"
                                : "Present"
                              : item.endDate
                                ? new Date(
                                    item.endDate
                                  ).getFullYear()
                                : ""}
                          </p>
                        )}

                        {translation?.description && (
                          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/50">
                            {translation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Experience */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "الخبرة" : "Experience"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar"
                ? "رحلتي"
                : "My Journey"}
            </h2>
          </div>

          {experienceItems.length === 0 ? (
            <p className="text-white/40">
              {language === "ar"
                ? "لا توجد معلومات خبرة متاحة حاليًا."
                : "No experience information available yet."}
            </p>
          ) : (
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />

              <div className="space-y-10">
                {experienceItems.map((item) => {
                  const translation = getTranslation(
                    item.translations
                  );

                  return (
                    <div
                      key={item.id}
                      className="relative pl-10"
                    >
                      <div className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-[#009F94] bg-[#010000]" />

                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#009F94]/30">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-xl font-semibold">
                            {translation?.title ??
                              (language === "ar"
                                ? "الخبرة"
                                : "Experience")}
                          </h3>

                          <span className="text-sm text-[#009F94]">
                            {item.isCurrent
                              ? language === "ar"
                                ? "حتى الآن"
                                : "Present"
                              : item.endDate
                                ? new Date(
                                    item.endDate
                                  ).getFullYear()
                                : ""}
                          </span>
                        </div>

                        {item.startDate && (
                          <p className="mt-2 text-sm text-white/30">
                            {new Date(
                              item.startDate
                            ).getFullYear()}
                            {" — "}
                            {item.isCurrent
                              ? language === "ar"
                                ? "حتى الآن"
                                : "Present"
                              : item.endDate
                                ? new Date(
                                    item.endDate
                                  ).getFullYear()
                                : ""}
                          </p>
                        )}

                        {translation?.description && (
                          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/50">
                            {translation.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Resume */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "السيرة الذاتية" : "Resume"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar"
                ? "سيرتي الذاتية"
                : "My Resumes"}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/50">
              {language === "ar"
                ? "يمكنك الاطلاع على السير الذاتية المتاحة واختيار النسخة التي تريد فتحها."
                : "View my available resumes and choose the version you want to open."}
            </p>
          </div>

          {resumes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <p className="text-white/40">
                {language === "ar"
                  ? "لا توجد سيرة ذاتية متاحة حاليًا."
                  : "No resume available yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-[#009F94]/30"
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {resume.title}
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                      {language === "ar"
                        ? "آخر تحديث: "
                        : "Updated "}
                      {new Date(
                        resume.updatedAt
                      ).toLocaleDateString(
                        language === "ar"
                          ? "ar-YE"
                          : "en-US"
                      )}
                    </p>
                  </div>

                  <a
                    href={`/api/resume/${resume.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-fit rounded-xl bg-[#009F94] px-5 py-2.5 text-sm font-medium text-black transition hover:bg-[#00b8aa]"
                  >
                    {language === "ar"
                      ? "عرض السيرة الذاتية"
                      : "View Resume"}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto grid w-full max-w-5xl gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#009F94]">
              {language === "ar" ? "تواصل" : "Contact"}
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              {language === "ar"
                ? "لنتواصل معًا"
                : "Let's Connect"}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/50">
              {language === "ar"
                ? "لديك فكرة مشروع أو سؤال أو ترغب فقط في التواصل؟ يمكنك استخدام نموذج التواصل أو أي من منصاتي الاجتماعية."
                : "Have a project idea, question, or just want to get in touch? Feel free to reach out through the contact form or any of my social platforms."}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/70 transition hover:border-[#009F94]/40 hover:bg-[#009F94]/10 hover:text-[#009F94]"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </section>

{/* Footer */}
<footer className="border-t border-white/10 bg-white/[0.015] px-6">
  <div className="mx-auto w-full max-w-6xl py-14">
    <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">

      {/* Brand */}
      <div className="max-w-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#009F94]/30 bg-[#009F94]/10 text-lg font-bold text-[#009F94]">
            M
          </div>

          <div>
            <p className="font-semibold">
              {profile?.brandName ?? "Merdo Zone"}
            </p>

            <p className="mt-0.5 text-xs text-white/35">
              {translation?.jobTitle ??
                (language === "ar"
                  ? "مطور Full-Stack"
                  : "Full-Stack Developer")}
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-white/35">
          {language === "ar"
            ? "بناء تطبيقات حديثة وأنظمة Backend وحلول رقمية عملية."
            : "Building modern applications, backend systems, and practical digital solutions."}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <a
          href="/"
          className="text-sm text-white/45 transition hover:text-[#009F94]"
        >
          {language === "ar" ? "الرئيسية" : "Home"}
        </a>

        <a
          href="/projects"
          className="text-sm text-white/45 transition hover:text-[#009F94]"
        >
          {language === "ar" ? "المشاريع" : "Projects"}
        </a>

        <a
          href="/contact"
          className="text-sm text-white/45 transition hover:text-[#009F94]"
        >
          {language === "ar" ? "التواصل" : "Contact"}
        </a>
      </div>
    </div>

    {/* Bottom */}
    <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

      <p className="text-xs text-white/25">
        © {new Date().getFullYear()}{" "}
        {profile?.brandName ?? "Merdo Zone"}{" "}
        {language === "ar" ? "— جميع الحقوق محفوظة" : "— All rights reserved"}
      </p>

      {socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-5">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/30 transition hover:text-[#009F94]"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  </div>
</footer>
   </main>
  );
}