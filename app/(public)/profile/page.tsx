import { getCurrentUser } from "@/app/actions/profile";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Profile & Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
}
