import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import EditExperienceForm from "./EditExperienceForm";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const experienceId = Number(id);

  if (!Number.isInteger(experienceId)) {
    notFound();
  }

  const experience = await prisma.experience.findUnique({
    where: {
      id: experienceId,
    },
    include: {
      translations: true,
    },
  });

  if (!experience) {
    notFound();
  }

  return (
    <EditExperienceForm experience={experience} />
  );
}