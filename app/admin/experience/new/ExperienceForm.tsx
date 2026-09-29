"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExperienceForm() {
  const router = useRouter();

  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isCurrent, setIsCurrent] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const [displayOrder, setDisplayOrder] = useState("0");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!titleEn.trim() && !titleAr.trim()) {
      alert("Please enter at least one title.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/experience",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: startDate || null,
            endDate:
              isCurrent || !endDate
                ? null
                : endDate,

            isCurrent,
            isVisible,

            displayOrder:
              Number(displayOrder) || 0,

            translations: [
              {
                languageCode: "en",
                title: titleEn.trim(),
                description:
                  descriptionEn.trim() || null,
              },
              {
                languageCode: "ar",
                title: titleAr.trim(),
                description:
                  descriptionAr.trim() || null,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create experience"
        );
      }

      router.push("/admin/experience");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create experience"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Add Experience
        </h1>

        <p className="mt-2 text-gray-500">
          Add a new experience or journey record.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* English */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">
            English
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Title
              </label>

              <input
                type="text"
                value={titleEn}
                onChange={(e) =>
                  setTitleEn(e.target.value)
                }
                placeholder="e.g. Personal Projects"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Description
              </label>

              <textarea
                value={descriptionEn}
                onChange={(e) =>
                  setDescriptionEn(e.target.value)
                }
                placeholder="Describe this experience..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>
          </div>
        </section>

        {/* Arabic */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">
            العربية
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                العنوان
              </label>

              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) =>
                  setTitleAr(e.target.value)
                }
                placeholder="مثال: المشاريع الشخصية"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                الوصف
              </label>

              <textarea
                dir="rtl"
                value={descriptionAr}
                onChange={(e) =>
                  setDescriptionAr(e.target.value)
                }
                placeholder="اكتب وصف هذه التجربة..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>
          </div>
        </section>

        {/* Dates */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">
            Timeline
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
                disabled={isCurrent}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94] disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(e) =>
                setIsCurrent(e.target.checked)
              }
              className="h-4 w-4 accent-[#009F94]"
            />

            Currently ongoing
          </label>
        </section>

        {/* Settings */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">
            Settings
          </h2>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-gray-400">
              Display Order
            </label>

            <input
              type="number"
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
            />
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) =>
                setIsVisible(e.target.checked)
              }
              className="h-4 w-4 accent-[#009F94]"
            />

            Visible on website
          </label>
        </section>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/experience")
            }
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#009F94] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Create Experience"}
          </button>
        </div>
      </form>
    </div>
  );
}