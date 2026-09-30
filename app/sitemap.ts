import type { MetadataRoute } from "next";
import { prisma } from "@/src/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://merdo-zone.vercel.app";

  const projects = await prisma.project.findMany({
    where: {
      isVisible: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });

  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    ...projectUrls,
  ];
}