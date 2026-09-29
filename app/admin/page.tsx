import { redirect } from "next/navigation";
import { getAdminSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [
    projectsCount,
    technologiesCount,
    categoriesCount,
    educationCount,
    experienceCount,
    messagesCount,
    newMessagesCount,
    resumesCount,

    visibleProjectsCount,
    visibleTechnologiesCount,
    visibleCategoriesCount,
    visibleEducationCount,
    visibleExperienceCount,
    visibleResumesCount,

    recentMessages,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),

    prisma.technology.count(),

    prisma.technologyCategory.count(),

    prisma.education.count(),

    prisma.experience.count(),

    prisma.contactMessage.count(),

    prisma.contactMessage.count({
      where: {
        status: "NEW",
      },
    }),

    prisma.resume.count(),

    prisma.project.count({
      where: {
        isVisible: true,
      },
    }),

    prisma.technology.count({
      where: {
        isVisible: true,
      },
    }),

    prisma.technologyCategory.count({
      where: {
        isVisible: true,
      },
    }),

    prisma.education.count({
      where: {
        isVisible: true,
      },
    }),

    prisma.experience.count({
      where: {
        isVisible: true,
      },
    }),

    prisma.resume.count({
      where: {
        isVisible: true,
      },
    }),

    prisma.contactMessage.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),

    prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        slug: true,
        coverImageUrl: true,
        isVisible: true,
        createdAt: true,
        translations: {
          where: {
            languageCode: "en",
          },
          take: 1,
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projectsCount,
      visible: visibleProjectsCount,
      href: "/admin/projects",
    },
    {
      label: "Technologies",
      value: technologiesCount,
      visible: visibleTechnologiesCount,
      href: "/admin/technologies",
    },
    {
      label: "Categories",
      value: categoriesCount,
      visible: visibleCategoriesCount,
      href: "/admin/technologies/categories",
    },
    {
      label: "Education",
      value: educationCount,
      visible: visibleEducationCount,
      href: "/admin/education",
    },
    {
      label: "Experience",
      value: experienceCount,
      visible: visibleExperienceCount,
      href: "/admin/experience",
    },
    {
      label: "Resumes",
      value: resumesCount,
      visible: visibleResumesCount,
      href: "/admin/resume",
    },
  ];

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#009F94]">
          Merdo Zone
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Welcome back, {session.username}
        </p>
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            A quick overview of your portfolio content.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#009F94]/30 hover:bg-white/[0.045]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-[#009F94]">
                    {stat.value}
                  </p>
                </div>

                <span className="text-white/20 transition group-hover:text-[#009F94]">
                  →
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {stat.visible} visible
              </p>
            </a>
          ))}

          {/* Messages */}
          <a
            href="/admin/messages"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-[#009F94]/30 hover:bg-white/[0.045]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  Messages
                </p>

                <p className="mt-3 text-3xl font-bold text-[#009F94]">
                  {messagesCount}
                </p>
              </div>

              <span className="text-white/20 transition group-hover:text-[#009F94]">
                →
              </span>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {newMessagesCount} new
            </p>
          </a>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access the most common actions.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/projects"
            className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-gray-300 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/5 hover:text-[#009F94]"
          >
            + Manage Projects
          </a>

          <a
            href="/admin/technologies"
            className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-gray-300 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/5 hover:text-[#009F94]"
          >
            + Manage Technologies
          </a>

          <a
            href="/admin/messages"
            className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-gray-300 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/5 hover:text-[#009F94]"
          >
            View Messages
          </a>

          <a
            href="/admin/resume"
            className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm text-gray-300 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/5 hover:text-[#009F94]"
          >
            Manage Resume
          </a>
        </div>
      </section>

      {/* Recent Content */}
      <section className="grid gap-6 xl:grid-cols-2">

        {/* Recent Messages */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="font-semibold text-white">
                Recent Messages
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Latest messages received from visitors.
              </p>
            </div>

            <a
              href="/admin/messages"
              className="text-xs text-[#009F94] transition hover:text-white"
            >
              View all
            </a>
          </div>

          {recentMessages.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No messages yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentMessages.map((message) => (
                <a
                  key={message.id}
                  href="/admin/messages"
                  className="block px-6 py-4 transition hover:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {message.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {message.subject || message.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        message.status === "NEW"
                          ? "bg-[#009F94]/10 text-[#009F94]"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {message.status}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-600">
                    {new Date(
                      message.createdAt
                    ).toLocaleString()}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <h2 className="font-semibold text-white">
                Recent Projects
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Recently added projects.
              </p>
            </div>

            <a
              href="/admin/projects"
              className="text-xs text-[#009F94] transition hover:text-white"
            >
              View all
            </a>
          </div>

          {recentProjects.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No projects yet.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentProjects.map((project) => {
                const name =
                  project.translations[0]?.name ??
                  project.slug;

                return (
                  <a
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition hover:bg-white/[0.02]"
                  >
                    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      {project.coverImageUrl ? (
                        <img
                          src={project.coverImageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] text-gray-600">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {project.slug}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                        project.isVisible
                          ? "bg-[#009F94]/10 text-[#009F94]"
                          : "bg-white/5 text-gray-500"
                      }`}
                    >
                      {project.isVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

      </section>
    </div>
  );
}