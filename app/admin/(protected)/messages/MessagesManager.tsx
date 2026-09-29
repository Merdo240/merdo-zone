"use client";

import { useEffect, useState } from "react";

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
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
        alert(
          data.message || "Failed to load messages"
        );
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

  if (loading) {
    return (
      <p className="text-white/50">
        Loading messages...
      </p>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-white/50">
          No messages yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold">
                  {message.name}
                </h2>

                <span className="rounded-full bg-[#009F94]/15 px-3 py-1 text-xs text-[#00cfc0]">
                  {message.status}
                </span>
              </div>

              <p className="mt-2 break-all text-sm text-white/50">
                {message.email}
              </p>

              {message.subject && (
                <p className="mt-4 font-medium">
                  {message.subject}
                </p>
              )}

              <p className="mt-3 whitespace-pre-wrap text-white/70">
                {message.message}
              </p>

              <p className="mt-4 text-xs text-white/30">
                {formatDate(message.createdAt)}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {message.status === "NEW" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      message.id,
                      "READ"
                    )
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
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
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                >
                  Archive
                </button>
              )}

              {message.status === "ARCHIVED" && (
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(
                      message.id,
                      "READ"
                    )
                  }
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
                >
                  Unarchive
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  deleteMessage(message.id)
                }
                className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}