import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import EditProjectForm from "./EditProjectForm";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      translations: true,
    },
  });

  if (!project) {
    notFound();
  }

  return <EditProjectForm project={project} />;
}