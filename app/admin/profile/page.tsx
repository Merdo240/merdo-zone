import { prisma } from "@/src/lib/prisma";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const profile = await prisma.profile.findFirst({
    include: {
      translations: true,
    },
  });

  return <ProfileForm profile={profile} />;
}