"use client";

import { FormEvent, useEffect, useState } from "react";

type SocialLink = {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  isVisible: boolean;
  displayOrder: number;
};

export default function SocialLinksManager() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadSocialLinks() {
    try {
      const response = await fetch("/api/admin/social-links");
      const data = await response.json();

      if (response.ok) {
        setSocialLinks(data.socialLinks || []);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load social links");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSocialLinks();
  }, []);

  function resetForm() {
    setPlatform("");
    setUrl("");
    setIcon("");
    setDisplayOrder(0);
    setIsVisible(true);
    setEditingId(null);
  }

  function startEditing(socialLink: SocialLink) {
    setEditingId(socialLink.id);
    setPlatform(socialLink.platform);
    setUrl(socialLink.url);
    setIcon(socialLink.icon || "");
    setDisplayOrder(socialLink.displayOrder);
    setIsVisible(socialLink.isVisible);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `/api/admin/social-links/${editingId}`
          : "/api/admin/social-links",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
            url,
            icon,
            displayOrder,
            isVisible,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            (isEditing
              ? "Failed to update social link"
              : "Failed to create social link")
        );
        return;
      }

      alert(
        isEditing
          ? "Social link updated successfully"
          : "Social link added successfully"
      );

      resetForm();
      await loadSocialLinks();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this social link?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/social-links/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete social link");
        return;
      }

      alert("Social link deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      await loadSocialLinks();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="w-full space-y-10">
      {/* Form */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {editingId !== null
              ? "Edit Social Link"
              : "Add Social Link"}
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Add and manage your social media and contact links.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Platform
            </label>

            <input
              type="text"
              value={platform}
              onChange={(event) =>
                setPlatform(event.target.value)
              }
              placeholder="GitHub"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              URL
            </label>

            <input
              type="url"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              placeholder="https://github.com/..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Icon
            </label>

            <input
              type="text"
              value={icon}
              onChange={(event) =>
                setIcon(event.target.value)
              }
              placeholder="github"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Display Order
            </label>

            <input
              type="number"
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(Number(event.target.value))
              }
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
            />
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
                  ? "Update Social Link"
                  : "Add Social Link"}
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

      {/* Existing Links */}
      <div className="border-t border-white/10 pt-8">
        <h2 className="mb-6 text-xl font-semibold">
          Existing Social Links
        </h2>

        {loading ? (
          <p className="text-white/50">Loading...</p>
        ) : socialLinks.length === 0 ? (
          <p className="text-white/50">
            No social links added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {socialLinks.map((socialLink) => (
              <div
                key={socialLink.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">
                      {socialLink.platform}
                    </h3>

                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        socialLink.isVisible
                          ? "bg-[#009F94]/20 text-[#00cfc0]"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {socialLink.isVisible
                        ? "Visible"
                        : "Hidden"}
                    </span>
                  </div>

                  <p className="mt-2 break-all text-sm text-white/50">
                    {socialLink.url}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    Order: {socialLink.displayOrder}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startEditing(socialLink)
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(socialLink.id)
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