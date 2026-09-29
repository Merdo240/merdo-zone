import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import DeleteTechnologyButton from "./DeleteTechnologyButton"; 

export default async function TechnologiesPage() {
  const technologies = await prisma.technology.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Technologies
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your technologies and skills.
          </p>
        </div>

        <Link
          href="/admin/technologies/new"
          className="rounded-xl bg-[#009F94] px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          + Add Technology
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {technologies.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No technologies found.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {technologies.map((technology) => {
              const englishTranslation =
                technology.translations.find(
                  (translation) =>
                    translation.languageCode === "en"
                );

              const arabicTranslation =
                technology.translations.find(
                  (translation) =>
                    translation.languageCode === "ar"
                );

              const technologyName =
                englishTranslation?.name ||
                arabicTranslation?.name ||
                `Technology #${technology.id}`;

              const englishCategory =
                technology.category.translations.find(
                  (translation) =>
                    translation.languageCode === "en"
                );

              const arabicCategory =
                technology.category.translations.find(
                  (translation) =>
                    translation.languageCode === "ar"
                );

              const categoryName =
                englishCategory?.name ||
                arabicCategory?.name ||
                `Category #${technology.categoryId}`;

              return (
                <div
                  key={technology.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      {technology.icon && (
                        <span className="text-sm text-[#009F94]">
                          {technology.icon}
                        </span>
                      )}

                      <h2 className="font-semibold text-white">
                        {technologyName}
                      </h2>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                      <span>{categoryName}</span>

                      <span>•</span>

                      <span>
                        {"★".repeat(technology.experienceLevel)}
                        {"☆".repeat(
                          5 - technology.experienceLevel
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        technology.isVisible
                          ? "bg-[#009F94]/10 text-[#009F94]"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {technology.isVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>

                    <Link
                      href={`/admin/technologies/${technology.id}`}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-[#009F94]/50 hover:text-[#009F94]"
                    >
                      Edit
                    </Link>
                  <DeleteTechnologyButton
  technologyId={technology.id}
/>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}