"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TechnologiesManager from "./technologies/TechnologiesManager";

type Translation = {
  id: number;
  languageCode: string;
  name: string;
  shortDescription: string | null;
  fullDescription: string | null;
};

type Project = {
  id: number;
  slug: string;
  coverImageUrl: string | null;
  coverImagePublicId: string | null;
  githubUrl: string | null;
  liveDemoUrl: string | null;
  isVisible: boolean;
  displayOrder: number;
  translations: Translation[];
};

export default function EditProjectForm({
  project,
}: {
  project: Project;
}) {
  const router = useRouter();

  const englishTranslation = project.translations.find(
    (translation) => translation.languageCode === "en"
  );

  const arabicTranslation = project.translations.find(
    (translation) => translation.languageCode === "ar"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [slug, setSlug] = useState(project.slug);
  const [githubUrl, setGithubUrl] = useState(project.githubUrl || "");
  const [liveDemoUrl, setLiveDemoUrl] = useState(
    project.liveDemoUrl || ""
  );
  const [isVisible, setIsVisible] = useState(project.isVisible);
  const [displayOrder, setDisplayOrder] = useState(
    String(project.displayOrder)
  );

  const [coverImage, setCoverImage] = useState<File | null>(null);

  const [englishName, setEnglishName] = useState(
    englishTranslation?.name || ""
  );
  const [englishShortDescription, setEnglishShortDescription] =
    useState(englishTranslation?.shortDescription || "");
  const [englishFullDescription, setEnglishFullDescription] =
    useState(englishTranslation?.fullDescription || "");

  const [arabicName, setArabicName] = useState(
    arabicTranslation?.name || ""
  );
  const [arabicShortDescription, setArabicShortDescription] =
    useState(arabicTranslation?.shortDescription || "");
  const [arabicFullDescription, setArabicFullDescription] =
    useState(arabicTranslation?.fullDescription || "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let coverImageUrl = project.coverImageUrl;
      let coverImagePublicId = project.coverImagePublicId;

      if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          setError(
            uploadData.message || "Failed to upload cover image"
          );
          return;
        }

        coverImageUrl = uploadData.url;
        coverImagePublicId = uploadData.publicId;
      }

      const response = await fetch(
        `/api/admin/projects/${project.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            coverImageUrl,
            coverImagePublicId,
            githubUrl: githubUrl || null,
            liveDemoUrl: liveDemoUrl || null,
            isVisible,
            displayOrder: Number(displayOrder),

            translations: [
              {
                languageCode: "en",
                name: englishName,
                shortDescription:
                  englishShortDescription || null,
                fullDescription:
                  englishFullDescription || null,
              },
              {
                languageCode: "ar",
                name: arabicName,
                shortDescription:
                  arabicShortDescription || null,
                fullDescription:
                  arabicFullDescription || null,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update project");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Edit Project
        </h1>

        <p className="mt-2 text-gray-400">
          Update your project information.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-[#009F94]">
          Basic Information
        </h2>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Slug
          </label>

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              GitHub URL
            </label>

            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Live Demo URL
            </label>

            <input
              type="url"
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Cover Image
          </label>

          {project.coverImageUrl && (
            <div className="mb-4">
              <p className="mb-2 text-xs text-gray-500">
                Current image
              </p>

              <img
                src={project.coverImageUrl}
                alt={englishName || "Project cover"}
                className="h-40 w-full max-w-md rounded-xl border border-white/10 object-cover"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) =>
              setCoverImage(e.target.files?.[0] || null)
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-gray-300 outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#009F94] file:px-4 file:py-2 file:font-semibold file:text-black"
          />

          <p className="mt-2 text-xs text-gray-500">
            Select a new image only if you want to replace the current one.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Display Order
            </label>

            <input
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
              min="0"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              id="isVisible"
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 accent-[#009F94]"
            />

            <label
              htmlFor="isVisible"
              className="text-sm text-gray-300"
            >
              Visible on website
            </label>
          </div>
        </div>
      </section>

      {/* English */}
      <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="text-xl font-semibold text-[#009F94]">
          English
        </h2>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Name
          </label>

          <input
            type="text"
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Short Description
          </label>

          <textarea
            value={englishShortDescription}
            onChange={(e) =>
              setEnglishShortDescription(e.target.value)
            }
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Full Description
          </label>

          <textarea
            value={englishFullDescription}
            onChange={(e) =>
              setEnglishFullDescription(e.target.value)
            }
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>
      </section>

      {/* Arabic */}
      <section
        dir="rtl"
        className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <h2 className="text-xl font-semibold text-[#009F94]">
          العربية
        </h2>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            الاسم
          </label>

          <input
            type="text"
            value={arabicName}
            onChange={(e) => setArabicName(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            الوصف المختصر
          </label>

          <textarea
            value={arabicShortDescription}
            onChange={(e) =>
              setArabicShortDescription(e.target.value)
            }
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            الوصف الكامل
          </label>

          <textarea
            value={arabicFullDescription}
            onChange={(e) =>
              setArabicFullDescription(e.target.value)
            }
            rows={6}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>
      </section>

      <TechnologiesManager projectId={project.id} />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/projects")}
          className="rounded-xl border border-white/10 px-5 py-3 text-gray-300 transition hover:bg-white/5"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#009F94] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}