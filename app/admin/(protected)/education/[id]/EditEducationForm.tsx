"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Translation = {
  id: number;
  languageCode: string;
  title: string;
  description: string | null;
};

type Education = {
  id: number;
  startDate: Date | string | null;
  endDate: Date | string | null;
  isCurrent: boolean;
  isVisible: boolean;
  displayOrder: number;
  translations: Translation[];
};

type Props = {
  education: Education;
};

function formatDate(date: Date | string | null) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toISOString().split("T")[0];
}

export default function EditEducationForm({
  education,
}: Props) {
  const router = useRouter();

  const english = education.translations.find(
    (translation) =>
      translation.languageCode === "en"
  );

  const arabic = education.translations.find(
    (translation) =>
      translation.languageCode === "ar"
  );

  const [form, setForm] = useState({
    startDate: formatDate(education.startDate),
    endDate: formatDate(education.endDate),
    isCurrent: education.isCurrent,
    isVisible: education.isVisible,
    displayOrder: education.displayOrder,

    enTitle: english?.title || "",
    enDescription: english?.description || "",

    arTitle: arabic?.title || "",
    arDescription: arabic?.description || "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: string,
    value: string | boolean | number
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/education/${education.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: form.startDate || null,

            endDate: form.isCurrent
              ? null
              : form.endDate || null,

            isCurrent: form.isCurrent,
            isVisible: form.isVisible,
            displayOrder: Number(form.displayOrder),

            translations: [
              {
                languageCode: "en",
                title: form.enTitle,
                description:
                  form.enDescription || null,
              },
              {
                languageCode: "ar",
                title: form.arTitle,
                description:
                  form.arDescription || null,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update education"
        );
      }

      router.push("/admin/education");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update education"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Edit Education
        </h1>

        <p className="mt-2 text-gray-500">
          Update this education record.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* English */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-[#009F94]">
            English
          </h2>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Title
            </label>

            <input
              type="text"
              value={form.enTitle}
              onChange={(event) =>
                updateField(
                  "enTitle",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Description
            </label>

            <textarea
              value={form.enDescription}
              onChange={(event) =>
                updateField(
                  "enDescription",
                  event.target.value
                )
              }
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>
        </section>

        {/* Arabic */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-[#009F94]">
            العربية
          </h2>

          <div dir="rtl">
            <label className="mb-2 block text-sm text-gray-400">
              العنوان
            </label>

            <input
              type="text"
              value={form.arTitle}
              onChange={(event) =>
                updateField(
                  "arTitle",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>

          <div dir="rtl">
            <label className="mb-2 block text-sm text-gray-400">
              الوصف
            </label>

            <textarea
              value={form.arDescription}
              onChange={(event) =>
                updateField(
                  "arDescription",
                  event.target.value
                )
              }
              rows={5}
              className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>
        </section>

        {/* Dates */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-[#009F94]">
            Education Period
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Start Date
              </label>

              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  updateField(
                    "startDate",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                End Date
              </label>

              <input
                type="date"
                value={form.endDate}
                disabled={form.isCurrent}
                onChange={(event) =>
                  updateField(
                    "endDate",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94] disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={(event) =>
                updateField(
                  "isCurrent",
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#009F94]"
            />

            Currently studying
          </label>
        </section>

        {/* Settings */}
        <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-[#009F94]">
            Settings
          </h2>

          <div>
            <label className="mb-2 block text-sm text-gray-400">
              Display Order
            </label>

            <input
              type="number"
              value={form.displayOrder}
              onChange={(event) =>
                updateField(
                  "displayOrder",
                  Number(event.target.value)
                )
              }
              min="0"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#009F94]"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.isVisible}
              onChange={(event) =>
                updateField(
                  "isVisible",
                  event.target.checked
                )
              }
              className="h-4 w-4 accent-[#009F94]"
            />

            Visible on website
          </label>
        </section>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/education")
            }
            className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white transition hover:border-white/20"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#009F94] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}