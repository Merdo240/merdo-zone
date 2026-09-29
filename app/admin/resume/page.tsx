import ResumeManager from "./ResumeManager";

export default function ResumePage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Resume
        </h1>

        <p className="mt-2 text-white/60">
          Upload and manage your resume.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <ResumeManager />
      </div>
    </div>
  );
}