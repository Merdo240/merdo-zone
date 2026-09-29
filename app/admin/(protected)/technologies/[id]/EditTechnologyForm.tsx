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
  translations: {
    languageCode: string;
    name: string;
  }[];
};

type Technology = {
  id: number;
  categoryId: number;
  icon: string | null;
  experienceLevel: number;
  isVisible: boolean;
  displayOrder: number;
  translations: Translation[];
};

export default function EditTechnologyForm({
  technology,
  categories,
}: {
  technology: Technology;
  categories: Category[];
}) {
  const router = useRouter();

  const englishTranslation = technology.translations.find(
    (translation) => translation.languageCode === "en"
  );

  const arabicTranslation = technology.translations.find(
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

  const [categoryId, setCategoryId] = useState(
    String(technology.categoryId)
  );

  const [icon, setIcon] = useState(
    technology.icon || ""
  );

  const [experienceLevel, setExperienceLevel] =
    useState(String(technology.experienceLevel));

  const [isVisible, setIsVisible] = useState(
    technology.isVisible
  );

  const [displayOrder, setDisplayOrder] = useState(
    String(technology.displayOrder)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/technologies/${technology.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryId: Number(categoryId),
            icon: icon || null,
            experienceLevel: Number(experienceLevel),
            isVisible,
            displayOrder: Number(displayOrder),

            translations: [
              {
                languageCode: "en",
                name: englishName,
                description:
                  englishDescription || null,
              },
              {
                languageCode: "ar",
                name: arabicName,
                description:
                  arabicDescription || null,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Failed to update technology"
        );
        return;
      }

      router.push("/admin/technologies");
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
          Edit Technology
        </h1>

        <p className="mt-2 text-gray-400">
          Update this technology.
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
          {/* Category */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            >
              <option value="">
                Select a category
              </option>

              {categories
                .filter(
                  (category) =>
                    category.isVisible ||
                    category.id === technology.categoryId
                )
                .map((category) => {
                  const englishTranslation =
                    category.translations.find(
                      (translation) =>
                        translation.languageCode === "en"
                    );

                  const arabicTranslation =
                    category.translations.find(
                      (translation) =>
                        translation.languageCode === "ar"
                    );

                  const name =
                    englishTranslation?.name ||
                    arabicTranslation?.name ||
                    `Category #${category.id}`;

                  return (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {name}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Icon */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Icon
            </label>

            <input
              type="text"
              value={icon}
              onChange={(e) =>
                setIcon(e.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />

            <p className="mt-2 text-xs text-gray-500">
              Icon URL for this technology.
            </p>
          </div>

          {/* Experience */}
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Experience Level
            </label>

            <select
              value={experienceLevel}
              onChange={(e) =>
                setExperienceLevel(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            >
              <option value="1">★☆☆☆☆ — 1/5</option>
              <option value="2">★★☆☆☆ — 2/5</option>
              <option value="3">★★★☆☆ — 3/5</option>
              <option value="4">★★★★☆ — 4/5</option>
              <option value="5">★★★★★ — 5/5</option>
            </select>
          </div>

          {/* Display Order */}
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

          {/* Visibility */}
          <div className="flex items-center gap-3 md:col-span-2">
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
            router.push("/admin/technologies")
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