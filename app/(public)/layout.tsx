import { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "./Navigation";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-surface">
      <Navigation />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
      <Toaster />
    </div>
  );
}
