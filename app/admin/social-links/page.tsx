import SocialLinksManager from "./SocialLinksManager";

export default function SocialLinksPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Social Links</h1>

        <p className="mt-2 text-white/60">
          Manage your social media and contact links.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <SocialLinksManager />
      </div>
    </div>
  );
}