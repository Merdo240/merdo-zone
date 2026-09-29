import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function TechnologyCategoriesPage() {
  const categories = await prisma.technologyCategory.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
      technologies: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Technology Categories
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your technology categories.
          </p>
        </div>

        <Link
          href="/admin/technologies/categories/new"
          className="rounded-xl bg-[#009F94] px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          + Add Category
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {categories.map((category) => {
              const englishTranslation =
                category.translations.find(
                  (translation) =>
                    translation.languageCode === "en"
                );

              const arabicTranslation =
                category.translations.find(
                  (translation) =>
                    translation.languageCode === "ar"
                );

              const categoryName =
                englishTranslation?.name ||
                arabicTranslation?.name ||
                `Category #${category.id}`;

              const technologyCount =
                category.technologies.length;

              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div>
                    <h2 className="font-semibold text-white">
                      {categoryName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {technologyCount}{" "}
                      {technologyCount === 1
                        ? "technology"
                        : "technologies"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        category.isVisible
                          ? "bg-[#009F94]/10 text-[#009F94]"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {category.isVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>

                    <Link
                      href={`/admin/technologies/categories/${category.id}`}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-[#009F94]/50 hover:text-[#009F94]"
                    >
                      Edit
                    </Link>
                    <DeleteCategoryButton categoryId={category.id} />
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