import MessagesManager from "./MessagesManager";

export default function MessagesPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Messages
        </h1>

        <p className="mt-2 text-white/60">
          View and manage messages sent through your
          contact form.
        </p>
      </div>

      <MessagesManager />
    </div>
  );
}