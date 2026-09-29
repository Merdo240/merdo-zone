import { prisma } from "@/src/lib/prisma";
import Link from "next/link";
import DeleteExperienceButton from "./DeleteExperienceButton";

export default async function ExperiencePage() {
  const experience = await prisma.experience.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
    },
  });

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Experience
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your experience and journey.
          </p>
        </div>

        <Link
          href="/admin/experience/new"
          className="rounded-xl bg-[#009F94] px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          Add Experience
        </Link>
      </div>

      {experience.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-gray-500">
          No experience records found.
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((item) => {
            const english = item.translations.find(
              (translation) =>
                translation.languageCode === "en"
            );

            const arabic = item.translations.find(
              (translation) =>
                translation.languageCode === "ar"
            );

            const title =
              english?.title ||
              arabic?.title ||
              "Untitled";

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.startDate
                        ? new Date(
                            item.startDate
                          ).toLocaleDateString()
                        : "No start date"}{" "}
                      —{" "}
                      {item.isCurrent
                        ? "Present"
                        : item.endDate
                        ? new Date(
                            item.endDate
                          ).toLocaleDateString()
                        : "No end date"}
                    </p>

                    <p className="mt-2 text-sm">
                      <span
                        className={
                          item.isVisible
                            ? "text-[#009F94]"
                            : "text-gray-500"
                        }
                      >
                        {item.isVisible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/experience/${item.id}`}
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white transition hover:border-[#009F94]/50 hover:text-[#009F94]"
                    >
                      Edit
                    </Link>

                    <DeleteExperienceButton
                      experienceId={item.id}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}