import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import DeleteProjectButton from "./DeleteProjectButton";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Projects
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your projects.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="rounded-xl bg-[#009F94] px-5 py-3 font-semibold text-black transition hover:opacity-90"
        >
          + Add Project
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No projects found.
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {projects.map((project) => {
              const englishTranslation = project.translations.find(
                (translation) => translation.languageCode === "en"
              );

              const arabicTranslation = project.translations.find(
                (translation) => translation.languageCode === "ar"
              );

              const projectName =
                englishTranslation?.name ||
                arabicTranslation?.name ||
                project.slug;

              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-4">
  {project.coverImageUrl && (
    <img
      src={project.coverImageUrl}
      alt={projectName}
      className="h-16 w-24 rounded-xl border border-white/10 object-cover"
    />
  )}

  <div>
    <h2 className="font-semibold text-white">
      {projectName}
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      /{project.slug}
    </p>
  </div>
</div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        project.isVisible
                          ? "bg-[#009F94]/10 text-[#009F94]"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {project.isVisible ? "Visible" : "Hidden"}
                    </span>

                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:border-[#009F94]/50 hover:text-[#009F94]"
                    >
                      Edit
                    </Link>
                    <DeleteProjectButton projectId={project.id} />
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