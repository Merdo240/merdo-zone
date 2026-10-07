"use client";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  budget: string | null;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "ARCHIVED";
  createdAt: string;
};

export default function MessagesManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMessages() {
    try {
      const response = await fetch(
        "/api/admin/contact-messages"
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load messages");
        return;
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function updateStatus(
    id: number,
    status: ContactMessage["status"]
  ) {
    try {
      const response = await fetch(
        `/api/admin/contact-messages/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update message status"
        );
        return;
      }

      await loadMessages();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  async function deleteMessage(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/contact-messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete message"
        );
        return;
      }

      await loadMessages();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function getStatusStyle(
    status: ContactMessage["status"]
  ) {
    switch (status) {
      case "NEW":
        return "border-[#009F94]/30 bg-[#009F94]/10 text-[#00cfc0]";

      case "READ":
        return "border-white/10 bg-white/5 text-white/60";

      case "ARCHIVED":
        return "border-white/10 bg-white/[0.03] text-white/35";

      default:
        return "border-white/10 bg-white/5 text-white/50";
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-white/50">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-[#009F94]" />
        <span>Loading messages...</span>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-white/30"
            stroke="currentColor"
            strokeWidth="1.7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H12l-4.5 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
            />
          </svg>
        </div>

        <p className="mt-4 text-sm text-white/50">
          No messages yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {messages.map((message) => (
        <article
          key={message.id}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/15"
        >
          {/* Top Accent */}
          <div
            className={`h-px w-full ${
              message.status === "NEW"
                ? "bg-[#009F94]/60"
                : "bg-transparent"
            }`}
          />

          <div className="p-5 md:p-7">
            {/* Header */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">
                    {message.name}
                  </h2>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${getStatusStyle(
                      message.status
                    )}`}
                  >
                    {message.status}
                  </span>

                  <span className="font-mono text-[11px] text-white/25">
                    #{message.id}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a
                    href={`mailto:${message.email}`}
                    className="text-white/45 transition hover:text-[#009F94]"
                  >
                    {message.email}
                  </a>

                  {message.phone && (
                    <a
                      href={`tel:${message.phone}`}
                      className="text-white/45 transition hover:text-[#009F94]"
                    >
                      {message.phone}
                    </a>
                  )}
                </div>
              </div>

              <p className="shrink-0 text-xs text-white/30">
                {formatDate(message.createdAt)}
              </p>
            </div>

            {/* Project Information */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                label="Service"
                value={message.service}
              />

              <InfoItem
                label="Budget"
                value={message.budget || "Not specified"}
              />

              <InfoItem
                label="Subject"
                value={message.subject}
                className="sm:col-span-2 lg:col-span-1"
              />
            </div>

            {/* Project Details */}
            <div className="mt-5 rounded-xl border border-white/[0.07] bg-black/20 p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#009F94]/80">
                Project Details
              </p>

              <p className="whitespace-pre-wrap text-sm leading-7 text-white/65">
                {message.message}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.07] pt-5">
              {message.status === "NEW" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(message.id, "READ")
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:border-[#009F94]/30 hover:bg-[#009F94]/5 hover:text-white"
                >
                  Mark as Read
                </button>
              )}

              {message.status !== "ARCHIVED" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      message.id,
                      "ARCHIVED"
                    )
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
                >
                  Archive
                </button>
              )}

              {message.status === "ARCHIVED" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(message.id, "READ")
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
                >
                  Unarchive
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  deleteMessage(message.id)
                }
                className="rounded-lg border border-red-500/15 px-4 py-2 text-sm text-red-400/70 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm text-white/70">
        {value}
      </p>
    </div>
  );
}