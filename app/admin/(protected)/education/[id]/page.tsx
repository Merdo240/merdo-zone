import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import EditEducationForm from "./EditEducationForm";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const educationId = Number(id);

  if (!Number.isInteger(educationId)) {
    notFound();
  }

  const education = await prisma.education.findUnique({
    where: {
      id: educationId,
    },
    include: {
      translations: true,
    },
  });

  if (!education) {
    notFound();
  }

  return (
    <EditEducationForm education={education} />
  );
}