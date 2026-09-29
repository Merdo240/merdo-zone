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
      icon: "⌘",
    },
    {
      label: "Technologies",
      value: technologiesCount,
      visible: visibleTechnologiesCount,
      href: "/admin/technologies",
      icon: "◇",
    },
    {
      label: "Categories",
      value: categoriesCount,
      visible: visibleCategoriesCount,
      href: "/admin/technologies/categories",
      icon: "▦",
    },
    {
      label: "Education",
      value: educationCount,
      visible: visibleEducationCount,
      href: "/admin/education",
      icon: "▤",
    },
    {
      label: "Experience",
      value: experienceCount,
      visible: visibleExperienceCount,
      href: "/admin/experience",
      icon: "◈",
    },
    {
      label: "Resumes",
      value: resumesCount,
      visible: visibleResumesCount,
      href: "/admin/resume",
      icon: "▱",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] space-y-8">

      {/* Welcome Header */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-7 sm:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#009F94]/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#009F94] shadow-[0_0_12px_#009F94]" />

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#009F94]">
                Control Center
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back, {session.username}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your portfolio content, projects, technologies and
              incoming messages from one place.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#009F94]/20 bg-[#009F94]/5 px-5 py-3 text-sm font-medium text-[#009F94] transition hover:border-[#009F94]/40 hover:bg-[#009F94]/10 hover:text-white"
          >
            <span>View Website</span>
            <span className="text-base">↗</span>
          </a>
        </div>
      </section>

      {/* Messages Alert */}
      {newMessagesCount > 0 && (
        <a
          href="/admin/messages"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-[#009F94]/20 bg-[#009F94]/[0.04] px-5 py-4 transition hover:border-[#009F94]/40 hover:bg-[#009F94]/[0.07]"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#009F94]/10 text-[#009F94]">
              !
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                You have {newMessagesCount} new{" "}
                {newMessagesCount === 1 ? "message" : "messages"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Click to review your latest messages.
              </p>
            </div>
          </div>

          <span className="text-sm text-[#009F94] transition group-hover:translate-x-1">
            →
          </span>
        </a>
      )}

      {/* Overview */}
      <section>
        <div className="mb-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009F94]">
                Overview
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Portfolio Statistics
              </h2>
            </div>

            <p className="hidden text-xs text-gray-600 sm:block">
              Current content status
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <a
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#009F94]/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-gray-400 transition group-hover:border-[#009F94]/20 group-hover:bg-[#009F94]/10 group-hover:text-[#009F94]">
                  {stat.icon}
                </div>

                <span className="text-lg text-white/20 transition group-hover:text-[#009F94]">
                  ↗
                </span>
              </div>

              <p className="mt-5 text-sm text-gray-500">
                {stat.label}
              </p>

              <div className="mt-1 flex items-end justify-between gap-3">
                <p className="text-3xl font-bold tracking-tight text-white">
                  {stat.value}
                </p>

                <span className="mb-1 rounded-full bg-[#009F94]/10 px-2.5 py-1 text-[10px] font-medium text-[#009F94]">
                  {stat.visible} visible
                </span>
              </div>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#009F94] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}

          {/* Messages Card */}
          <a
            href="/admin/messages"
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#009F94]/30 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-lg text-gray-400 transition group-hover:border-[#009F94]/20 group-hover:bg-[#009F94]/10 group-hover:text-[#009F94]">
                ◉
              </div>

              <span className="text-lg text-white/20 transition group-hover:text-[#009F94]">
                ↗
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Messages
            </p>

            <div className="mt-1 flex items-end justify-between gap-3">
              <p className="text-3xl font-bold tracking-tight text-white">
                {messagesCount}
              </p>

              <span
                className={`mb-1 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                  newMessagesCount > 0
                    ? "bg-[#009F94]/10 text-[#009F94]"
                    : "bg-white/5 text-gray-500"
                }`}
              >
                {newMessagesCount} new
              </span>
            </div>

            <div className="absolute bottom-0 left-0 h-px w-0 bg-[#009F94] transition-all duration-300 group-hover:w-full" />
          </a>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#009F94]">
            Shortcuts
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            Quick Actions
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/projects"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/[0.04]"
          >
            <span className="text-sm text-gray-300 group-hover:text-white">
              Manage Projects
            </span>

            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-[#009F94]">
              →
            </span>
          </a>

          <a
            href="/admin/technologies"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/[0.04]"
          >
            <span className="text-sm text-gray-300 group-hover:text-white">
              Manage Technologies
            </span>

            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-[#009F94]">
              →
            </span>
          </a>

          <a
            href="/admin/messages"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/[0.04]"
          >
            <span className="text-sm text-gray-300 group-hover:text-white">
              View Messages
            </span>

            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-[#009F94]">
              →
            </span>
          </a>

          <a
            href="/admin/resume"
            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/[0.04]"
          >
            <span className="text-sm text-gray-300 group-hover:text-white">
              Manage Resume
            </span>

            <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-[#009F94]">
              →
            </span>
          </a>
        </div>
      </section>

      {/* Recent Content */}
      <section className="grid gap-5 xl:grid-cols-2">

        {/* Recent Messages */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#009F94]">
                Inbox
              </p>

              <h2 className="mt-1 font-semibold text-white">
                Recent Messages
              </h2>
            </div>

            <a
              href="/admin/messages"
              className="rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:bg-white/5 hover:text-[#009F94]"
            >
              View all →
            </a>
          </div>

          {recentMessages.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-gray-600">
                ◉
              </div>

              <p className="mt-4 text-sm text-gray-500">
                No messages yet.
              </p>

              <p className="mt-1 text-xs text-gray-700">
                Messages from your contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentMessages.map((message) => (
                <a
                  key={message.id}
                  href="/admin/messages"
                  className="group block px-5 py-4 transition hover:bg-white/[0.025]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-xs font-semibold text-gray-500 group-hover:border-[#009F94]/20 group-hover:text-[#009F94]">
                      {message.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-medium text-white">
                          {message.name}
                        </p>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ${
                            message.status === "NEW"
                              ? "bg-[#009F94]/10 text-[#009F94]"
                              : "bg-white/5 text-gray-600"
                          }`}
                        >
                          {message.status}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-gray-600">
                        {message.subject || message.email}
                      </p>

                      <p className="mt-1 text-[10px] text-gray-700">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#009F94]">
                Portfolio
              </p>

              <h2 className="mt-1 font-semibold text-white">
                Recent Projects
              </h2>
            </div>

            <a
              href="/admin/projects"
              className="rounded-lg px-3 py-2 text-xs text-gray-500 transition hover:bg-white/5 hover:text-[#009F94]"
            >
              View all →
            </a>
          </div>

          {recentProjects.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-gray-600">
                ◇
              </div>

              <p className="mt-4 text-sm text-gray-500">
                No projects yet.
              </p>

              <p className="mt-1 text-xs text-gray-700">
                Add your first project from the Projects section.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentProjects.map((project) => {
                const name =
                  project.translations[0]?.name ?? project.slug;

                return (
                  <a
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.025]"
                  >
                    <div className="h-12 w-[68px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                      {project.coverImageUrl ? (
                        <img
                          src={project.coverImageUrl}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] text-gray-700">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-600">
                        {project.slug}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${
                        project.isVisible
                          ? "bg-[#009F94]/10 text-[#009F94]"
                          : "bg-white/5 text-gray-600"
                      }`}
                    >
                      {project.isVisible ? "Visible" : "Hidden"}
                    </span>

                    <span className="hidden text-gray-700 transition group-hover:text-[#009F94] sm:block">
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer Status */}
      <div className="flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 text-[10px] text-gray-700 sm:flex-row">
        <span>Merdo Zone Admin</span>

        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#009F94]" />
          System Online
        </span>
      </div>
    </div>
  );
}
