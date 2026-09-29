"use client";

import { useEffect, useState } from "react";

type Technology = {
  id: number;
  translations?: {
    languageCode: string;
    name: string;
  }[];
  category?: {
    translations?: {
      languageCode: string;
      name: string;
    }[];
  };
};

type Props = {
  projectId: number;
};

export default function TechnologiesManager({
  projectId,
}: Props) {
  const [allTechnologies, setAllTechnologies] = useState<
    Technology[]
  >([]);

  const [selectedTechnologies, setSelectedTechnologies] =
    useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTechnologies();
  }, []);

  async function loadTechnologies() {
    setLoading(true);
    setError("");

    try {
      const [technologiesResponse, projectResponse] =
        await Promise.all([
          fetch("/api/admin/technologies"),
          fetch(
            `/api/admin/projects/${projectId}/technologies`
          ),
        ]);

      const technologiesData =
        await technologiesResponse.json();

      const projectData =
        await projectResponse.json();

      if (!technologiesResponse.ok) {
        throw new Error(
          technologiesData.message ||
            "Failed to load technologies"
        );
      }

      if (!projectResponse.ok) {
        throw new Error(
          projectData.message ||
            "Failed to load project technologies"
        );
      }

      const technologies =
        technologiesData.technologies ||
        technologiesData.data ||
        [];

      const projectTechnologies =
        projectData.technologies ||
        projectData.data ||
        [];

      setAllTechnologies(technologies);

     setSelectedTechnologies(
  projectTechnologies.map(
    (projectTechnology: any) =>
      projectTechnology.technology.id
  )
);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load technologies"
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleTechnology(technologyId: number) {
    setSelectedTechnologies((current) => {
      if (current.includes(technologyId)) {
        return current.filter(
          (id) => id !== technologyId
        );
      }

      return [...current, technologyId];
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const currentResponse = await fetch(
        `/api/admin/projects/${projectId}/technologies`
      );

      const currentData =
        await currentResponse.json();

      if (!currentResponse.ok) {
        throw new Error(
          currentData.message ||
            "Failed to load current technologies"
        );
      }

      const currentTechnologies =
        currentData.technologies ||
        currentData.data ||
        [];

      const currentIds = currentTechnologies.map(
  (projectTechnology: any) =>
    projectTechnology.technology.id
);

      const technologiesToAdd =
        selectedTechnologies.filter(
          (id) => !currentIds.includes(id)
        );

      const technologiesToRemove =
        currentIds.filter(
          (id: number) =>
            !selectedTechnologies.includes(id)
        );

      for (const technologyId of technologiesToAdd) {
        const response = await fetch(
          `/api/admin/projects/${projectId}/technologies`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              technologyId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to add technology"
          );
        }
      }

      for (const technologyId of technologiesToRemove) {
        const response = await fetch(
  `/api/admin/projects/${projectId}/technologies`,
  {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      technologyId,
    }),
  }
);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to remove technology"
          );
        }
      }

      await loadTechnologies();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save technologies"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div>
        <h2 className="text-xl font-semibold text-[#009F94]">
          Technologies
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the technologies used in this project.
        </p>
      </div>

      {loading ? (
        <div className="py-6 text-center text-gray-500">
          Loading technologies...
        </div>
      ) : allTechnologies.length === 0 ? (
        <div className="rounded-xl border border-white/10 p-5 text-center text-gray-500">
          No technologies found.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allTechnologies.map((technology) => {
            const selected =
              selectedTechnologies.includes(
                technology.id
              );

            return (
              <button
                key={technology.id}
                type="button"
                onClick={() =>
                  toggleTechnology(technology.id)
                }
                className={`rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-[#009F94]/50 bg-[#009F94]/10"
                    : "border-white/10 bg-black hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
                      selected
                        ? "border-[#009F94] bg-[#009F94] text-black"
                        : "border-white/20"
                    }`}
                  >
                    {selected ? "✓" : ""}
                  </div>

                  <div>
  <p className="font-medium text-white">
    {technology.translations?.find(
      (translation) => translation.languageCode === "en"
    )?.name ||
      technology.translations?.find(
        (translation) => translation.languageCode === "ar"
      )?.name ||
      "Unnamed Technology"}
  </p>

  <p className="mt-1 text-xs text-gray-500">
    {technology.category?.translations?.find(
      (translation) => translation.languageCode === "en"
    )?.name ||
      technology.category?.translations?.find(
        (translation) => translation.languageCode === "ar"
      )?.name ||
      "No Category"}
  </p>
</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {selectedTechnologies.length} selected
        </p>

        <button
          type="button"
          onClick={handleSave}
          disabled={loading || saving}
          className="rounded-xl bg-[#009F94] px-5 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Technologies"}
        </button>
      </div>
    </section>
  );
}