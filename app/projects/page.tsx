import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();

  const language =
    cookieStore.get("language")?.value === "ar" ? "ar" : "en";

  const isArabic = language === "ar";

  return {
    title: isArabic ? "المشاريع" : "Projects",

    description: isArabic
      ? "استكشف مجموعة من المشاريع والتطبيقات البرمجية التي بنيتها خلال رحلتي في تطوير البرمجيات."
      : "Explore a collection of web projects and software applications built throughout my development journey.",

    alternates: {
      canonical: "/projects",
    },

    openGraph: {
      title: isArabic
        ? "المشاريع | Merdo Zone"
        : "Projects | Merdo Zone",

      description: isArabic
        ? "استكشف مجموعة من المشاريع والتطبيقات البرمجية التي بنيتها خلال رحلتي في تطوير البرمجيات."
        : "Explore a collection of web projects and software applications built throughout my development journey.",

      url: "/projects",
      type: "website",
    },
  };
}

export default async function ProjectsPage() {
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

  const projects = await prisma.project.findMany({
    where: {
      isVisible: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
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

  const isArabic = language === "ar";

  return (
    <main className="min-h-screen bg-[#010000] px-6 pb-24 pt-32">
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-16">
          <p className="mb-3 text-sm font-medium tracking-[0.25em] text-[#009F94]">
            {isArabic ? "مشاريعي" : "MY WORK"}
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {isArabic ? "المشاريع" : "Projects"}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            {isArabic
              ? "مجموعة من المشاريع والتطبيقات التي بنيتها خلال رحلتي في تطوير البرمجيات."
              : "A collection of projects and applications I have built throughout my development journey."}
          </p>
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-white/50">
              {isArabic
                ? "لا توجد مشاريع متاحة حاليًا."
                : "No projects available yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => {
              const translation = getTranslation(project.translations);

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-[#009F94]/40 hover:bg-white/[0.05]"
                >
                  {/* Cover */}
                  {project.coverImageUrl ? (
                    <div className="aspect-video overflow-hidden border-b border-white/10">
                      <img
                        src={project.coverImageUrl}
                        alt={translation?.name ?? project.slug}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center border-b border-white/10 bg-white/[0.02]">
                      <span className="text-4xl font-bold text-[#009F94]/40">
                        MZ
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">

                    <h2 className="text-2xl font-semibold text-white">
                      {translation?.name ?? project.slug}
                    </h2>

                    <p className="mt-3 leading-7 text-white/50">
                      {translation?.shortDescription ??
                        (isArabic
                          ? "لا يوجد وصف متاح."
                          : "No description available.")}
                    </p>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.map((item) => {
                          const technologyTranslation = getTranslation(
                            item.technology.translations
                          );

                          return (
                            <span
                              key={item.technology.id}
                              className="rounded-lg border border-[#009F94]/20 bg-[#009F94]/5 px-3 py-1.5 text-xs text-[#009F94]"
                            >
                              {technologyTranslation?.name ??
                                item.technology.icon ??
                                "Tech"}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">

                      <Link
                        href={`/projects/${project.slug}`}
                        className="rounded-lg bg-[#009F94] px-5 py-2.5 text-sm font-medium text-black transition hover:bg-[#00b8aa]"
                      >
                        {isArabic ? "عرض المشروع" : "View Details"}
                      </Link>

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                        >
                          GitHub
                        </a>
                      )}

                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                        >
                          {isArabic ? "التجربة المباشرة" : "Live Demo"}
                        </a>
                      )}

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}