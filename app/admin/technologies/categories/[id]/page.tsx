import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import EditCategoryForm from "./EditCategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId)) {
    notFound();
  }

  const category = await prisma.technologyCategory.findUnique({
    where: {
      id: categoryId,
    },
    include: {
      translations: true,
    },
  });

  if (!category) {
    notFound();
  }

  return <EditCategoryForm category={category} />;
}