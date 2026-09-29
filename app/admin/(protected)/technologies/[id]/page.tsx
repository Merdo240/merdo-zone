import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import EditTechnologyForm from "./EditTechnologyForm";

export default async function EditTechnologyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const technologyId = Number(id);

  if (!Number.isInteger(technologyId)) {
    notFound();
  }

  const technology = await prisma.technology.findUnique({
    where: {
      id: technologyId,
    },
    include: {
      translations: true,
    },
  });

  if (!technology) {
    notFound();
  }

  const categories = await prisma.technologyCategory.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    include: {
      translations: true,
    },
  });

  return (
    <EditTechnologyForm
      technology={technology}
      categories={categories}
    />
  );
}