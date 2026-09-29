import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    include: {
      translations: true,
      images: {
        orderBy: {
          displayOrder: "asc",
        },
      },
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

  if (!project || !project.isVisible) {
    notFound();
  }

  const translation = getTranslation(project.translations);

  const isArabic = language === "ar";

  return (
    <main className="min-h-screen bg-[#010000] px-6 pb-24 pt-32">
      <div className="mx-auto w-full max-w-6xl">

        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-[#009F94]"
        >
          <span>{isArabic ? "→" : "←"}</span>
          {isArabic ? "العودة إلى المشاريع" : "Back to Projects"}
        </Link>

        {/* Cover */}
        {project.coverImageUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <img
              src={project.coverImageUrl}
              alt={translation?.name ?? project.slug}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="mt-10">
          <p className="mb-3 text-sm font-medium tracking-[0.25em] text-[#009F94]">
            {isArabic ? "تفاصيل المشروع" : "PROJECT DETAILS"}
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {translation?.name ?? project.slug}
          </h1>

          {translation?.shortDescription && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/50">
              {translation.shortDescription}
            </p>
          )}
        </div>

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-white">
              {isArabic ? "التقنيات المستخدمة" : "Technologies Used"}
            </h2>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((item) => {
                const technologyTranslation = getTranslation(
                  item.technology.translations
                );

                return (
                  <span
                    key={item.technology.id}
                    className="rounded-lg border border-[#009F94]/20 bg-[#009F94]/5 px-4 py-2 text-sm text-[#009F94]"
                  >
                    {technologyTranslation?.name ??
                      item.technology.icon ??
                      "Tech"}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Description */}
        {translation?.fullDescription && (
          <section className="mt-12">
            <h2 className="mb-5 text-2xl font-semibold text-white">
              {isArabic ? "عن المشروع" : "About the Project"}
            </h2>

            <div className="max-w-4xl whitespace-pre-line text-base leading-8 text-white/60">
              {translation.fullDescription}
            </div>
          </section>
        )}

        {/* Gallery */}
        {project.images.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-semibold text-white">
              {isArabic ? "صور المشروع" : "Project Gallery"}
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {project.images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.altText || translation?.name || project.slug}
                    className="w-full object-cover transition duration-500 hover:scale-[1.02]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Links */}
        <div className="mt-14 flex flex-wrap gap-4">

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#009F94] px-6 py-3 text-sm font-medium text-black transition hover:bg-[#00b8aa]"
            >
              GitHub
            </a>
          )}

          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              {isArabic ? "التجربة المباشرة" : "Live Demo"}
            </a>
          )}

        </div>

      </div>
    </main>
  );
}