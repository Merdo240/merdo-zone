"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Translation = {
  id: number;
  languageCode: string;
  name: string;
  description: string | null;
};

type Category = {
  id: number;
  isVisible: boolean;
  displayOrder: number;
  translations: Translation[];
};

export default function EditCategoryForm({
  category,
}: {
  category: Category;
}) {
  const router = useRouter();

  const englishTranslation = category.translations.find(
    (translation) => translation.languageCode === "en"
  );

  const arabicTranslation = category.translations.find(
    (translation) => translation.languageCode === "ar"
  );

  const [englishName, setEnglishName] = useState(
    englishTranslation?.name || ""
  );

  const [englishDescription, setEnglishDescription] =
    useState(englishTranslation?.description || "");

  const [arabicName, setArabicName] = useState(
    arabicTranslation?.name || ""
  );

  const [arabicDescription, setArabicDescription] =
    useState(arabicTranslation?.description || "");

  const [isVisible, setIsVisible] = useState(
    category.isVisible
  );

  const [displayOrder, setDisplayOrder] = useState(
    String(category.displayOrder)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/technology-categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isVisible,
            displayOrder: Number(displayOrder),

            translations: [
              {
                languageCode: "en",
                name: englishName,
                description: englishDescription || null,
              },
              {
                languageCode: "ar",
                name: arabicName,
                description: arabicDescription || null,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to update category"
        );
        return;
      }

      router.push("/admin/technologies/categories");
      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Edit Technology Category
        </h1>

        <p className="mt-2 text-gray-400">
          Update this technology category.
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

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Display Order
            </label>

            <input
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>

          <div className="flex items-center gap-3 pt-8">
            <input
              id="isVisible"
              type="checkbox"
              checked={isVisible}
              onChange={(e) =>
                setIsVisible(e.target.checked)
              }
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
            onChange={(e) =>
              setEnglishName(e.target.value)
            }
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Description
          </label>

          <textarea
            value={englishDescription}
            onChange={(e) =>
              setEnglishDescription(e.target.value)
            }
            rows={4}
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
            onChange={(e) =>
              setArabicName(e.target.value)
            }
            required
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            الوصف
          </label>

          <textarea
            value={arabicDescription}
            onChange={(e) =>
              setArabicDescription(e.target.value)
            }
            rows={4}
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/technologies/categories")
          }
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