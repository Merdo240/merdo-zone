import { redirect } from "next/navigation";
import { getAdminSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const newMessagesCount = await prisma.contactMessage.count({
    where: {
      status: "NEW",
    },
  });

  return (
    <div className="min-h-screen bg-[#010000] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#009F94]">
              Merdo Zone
            </h1>

            <p className="text-xs text-gray-500">
              Admin Dashboard
            </p>
          </div>

          <div className="text-sm text-gray-400">
            {session.username}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="min-h-[calc(100vh-73px)] w-64 border-r border-white/10 p-4">
          <nav className="space-y-2">
            <a
              href="/admin"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Dashboard
            </a>

            <a
              href="/admin/profile"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Profile
            </a>

            <a
              href="/admin/social-links"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Social Links
            </a>

            <a
              href="/admin/projects"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Projects
            </a>

            <a
              href="/admin/technologies"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Technologies
            </a>

            <a
              href="/admin/technologies/categories"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Technology Categories
            </a>

            <a
              href="/admin/education"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Education
            </a>

            <a
              href="/admin/experience"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Experience
            </a>

            {/* Messages */}
            <a
              href="/admin/messages"
              className="flex items-center justify-between rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              <span>Messages</span>

              {newMessagesCount > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#009F94]/15 px-2 text-xs font-semibold text-[#009F94]">
                  {newMessagesCount}
                </span>
              )}
            </a>

            <a
              href="/admin/resume"
              className="block rounded-lg px-4 py-3 text-gray-300 transition hover:bg-[#009F94]/10 hover:text-[#009F94]"
            >
              Resume
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}