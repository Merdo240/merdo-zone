"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Translation = {
  languageCode: string;
  jobTitle: string;
  shortBio: string | null;
  about: string | null;
  heroTitle: string | null;
  heroDescription: string | null;
};

type Profile = {
  id: number;
  brandName: string;
  translations: Translation[];
} | null;

type Props = {
  profile: Profile;
};

export default function ProfileForm({ profile }: Props) {
  const router = useRouter();

  const english = profile?.translations.find(
    (translation) =>
      translation.languageCode === "en"
  );

  const arabic = profile?.translations.find(
    (translation) =>
      translation.languageCode === "ar"
  );

  const [brandName, setBrandName] = useState(
    profile?.brandName || "Merdo Zone"
  );

  const [jobTitleEn, setJobTitleEn] = useState(
    english?.jobTitle || "Full-Stack Developer"
  );

  const [shortBioEn, setShortBioEn] = useState(
    english?.shortBio || ""
  );

  const [aboutEn, setAboutEn] = useState(
    english?.about || ""
  );

  const [heroTitleEn, setHeroTitleEn] = useState(
    english?.heroTitle || ""
  );

  const [heroDescriptionEn, setHeroDescriptionEn] =
    useState(english?.heroDescription || "");

  const [jobTitleAr, setJobTitleAr] = useState(
    arabic?.jobTitle || "مطور Full-Stack"
  );

  const [shortBioAr, setShortBioAr] = useState(
    arabic?.shortBio || ""
  );

  const [aboutAr, setAboutAr] = useState(
    arabic?.about || ""
  );

  const [heroTitleAr, setHeroTitleAr] = useState(
    arabic?.heroTitle || ""
  );

  const [heroDescriptionAr, setHeroDescriptionAr] =
    useState(arabic?.heroDescription || "");

  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!brandName.trim()) {
      alert("Brand name is required.");
      return;
    }

    if (
      !jobTitleEn.trim() &&
      !jobTitleAr.trim()
    ) {
      alert("Please enter at least one job title.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/admin/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brandName: brandName.trim(),

            translations: [
              {
                languageCode: "en",
                jobTitle: jobTitleEn.trim(),
                shortBio:
                  shortBioEn.trim() || null,
                about:
                  aboutEn.trim() || null,
                heroTitle:
                  heroTitleEn.trim() || null,
                heroDescription:
                  heroDescriptionEn.trim() || null,
              },
              {
                languageCode: "ar",
                jobTitle: jobTitleAr.trim(),
                shortBio:
                  shortBioAr.trim() || null,
                about:
                  aboutAr.trim() || null,
                heroTitle:
                  heroTitleAr.trim() || null,
                heroDescription:
                  heroDescriptionAr.trim() || null,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save profile"
        );
      }

      alert("Profile saved successfully.");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage the main information displayed across
          your website.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* General */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">
            General
          </h2>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-gray-400">
              Brand Name
            </label>

            <input
              type="text"
              value={brandName}
              onChange={(e) =>
                setBrandName(e.target.value)
              }
              placeholder="Merdo Zone"
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
            />
          </div>
        </section>

        {/* English */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">
            English
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Job Title
              </label>

              <input
                type="text"
                value={jobTitleEn}
                onChange={(e) =>
                  setJobTitleEn(e.target.value)
                }
                placeholder="Full-Stack Developer"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Short Bio
              </label>

              <textarea
                value={shortBioEn}
                onChange={(e) =>
                  setShortBioEn(e.target.value)
                }
                rows={4}
                placeholder="A short introduction..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                About
              </label>

              <textarea
                value={aboutEn}
                onChange={(e) =>
                  setAboutEn(e.target.value)
                }
                rows={7}
                placeholder="Tell visitors more about yourself..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Hero Title
              </label>

              <input
                type="text"
                value={heroTitleEn}
                onChange={(e) =>
                  setHeroTitleEn(e.target.value)
                }
                placeholder="Building systems that matter."
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Hero Description
              </label>

              <textarea
                value={heroDescriptionEn}
                onChange={(e) =>
                  setHeroDescriptionEn(e.target.value)
                }
                rows={4}
                placeholder="Short description for the hero section..."
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
                المسمى
              </label>

              <input
                type="text"
                dir="rtl"
                value={jobTitleAr}
                onChange={(e) =>
                  setJobTitleAr(e.target.value)
                }
                placeholder="مطور Full-Stack"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                النبذة المختصرة
              </label>

              <textarea
                dir="rtl"
                value={shortBioAr}
                onChange={(e) =>
                  setShortBioAr(e.target.value)
                }
                rows={4}
                placeholder="نبذة مختصرة عنك..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عني
              </label>

              <textarea
                dir="rtl"
                value={aboutAr}
                onChange={(e) =>
                  setAboutAr(e.target.value)
                }
                rows={7}
                placeholder="اكتب نبذة تفصيلية عنك..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                عنوان Hero
              </label>

              <input
                type="text"
                dir="rtl"
                value={heroTitleAr}
                onChange={(e) =>
                  setHeroTitleAr(e.target.value)
                }
                placeholder="أبني أنظمة تصنع فرقًا."
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">
                وصف Hero
              </label>

              <textarea
                dir="rtl"
                value={heroDescriptionAr}
                onChange={(e) =>
                  setHeroDescriptionAr(e.target.value)
                }
                rows={4}
                placeholder="وصف مختصر يظهر في القسم الرئيسي..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none transition focus:border-[#009F94]"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#009F94] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}