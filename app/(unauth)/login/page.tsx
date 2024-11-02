import { auth } from "@/lib/auth";
import LoginForm from "./login-form";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    // Redirect based on user role
    if (session.user?.role === "ADMIN") {
      redirect("/admin/");
    } else {
      redirect("/workouts/");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <LoginForm />
    </div>
  );
}
