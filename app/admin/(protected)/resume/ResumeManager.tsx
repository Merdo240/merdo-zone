"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Resume = {
  id: number;
  title: string;
  fileUrl: string;
  publicId: string | null;
  assetId: string | null;
  isVisible: boolean;
  createdAt: string;
};

export default function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [assetId, setAssetId] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadResumes() {
    try {
      const response = await fetch("/api/admin/resume");
      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load resumes");
        return;
      }

      setResumes(data.resumes || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  function resetForm() {
    setTitle("");
    setFileUrl("");
    setPublicId("");
    setAssetId("");
    setIsVisible(true);
    setEditingId(null);
  }

  function startEditing(resume: Resume) {
    setEditingId(resume.id);
    setTitle(resume.title);
    setFileUrl(resume.fileUrl);
    setPublicId(resume.publicId || "");
    setAssetId(resume.assetId || "");
    setIsVisible(resume.isVisible);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `/api/admin/resume/${editingId}`
          : "/api/admin/resume",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            fileUrl,
            publicId,
            assetId,
            isVisible,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            (isEditing
              ? "Failed to update resume"
              : "Failed to create resume")
        );
        return;
      }

      alert(
        isEditing
          ? "Resume updated successfully"
          : "Resume added successfully"
      );

      resetForm();
      await loadResumes();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function deleteResume(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/resume/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete resume");
        return;
      }

      alert("Resume deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      await loadResumes();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to upload resume");
        return;
      }

      setFileUrl(data.url);
      setPublicId(data.publicId);
      setAssetId(data.assetId);

      alert("Resume uploaded successfully");
    } catch (error) {
      console.error(error);
      alert(
        "Something went wrong while uploading the resume"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full space-y-10">
      {/* Form */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {editingId !== null
              ? "Edit Resume"
              : "Add Resume"}
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Upload and manage your resume.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Resume Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="My Resume"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Resume File
            </label>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />

            <p className="mt-2 text-xs text-white/40">
              PDF, DOC, or DOCX
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(event) =>
                setIsVisible(event.target.checked)
              }
            />

            <span>Visible</span>
          </label>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#009F94] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Resume"
                  : "Add Resume"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-white/10 px-6 py-3 font-medium text-white transition hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Existing Resumes */}
      <div className="border-t border-white/10 pt-8">
        <h2 className="mb-6 text-xl font-semibold">
          Existing Resumes
        </h2>

        {loading ? (
          <p className="text-white/50">
            Loading...
          </p>
        ) : resumes.length === 0 ? (
          <p className="text-white/50">
            No resumes added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold">
                      {resume.title}
                    </h3>

                    <span className="rounded-full bg-[#009F94]/20 px-2 py-1 text-xs text-[#00cfc0]">
                      {resume.isVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm text-white/50">
                    {resume.fileUrl}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`/api/resume/${resume.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                  >
                    Open
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      startEditing(resume)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteResume(resume.id)
                    }
                    className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}