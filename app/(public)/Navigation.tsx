"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Video,
  Dumbbell,
  Calendar,
  LayoutDashboard,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/yoga", label: "Yoga", icon: Video },
  { href: "/programmes", label: "Programmes", icon: Calendar },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-64 bg-surface-grey shadow-md flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground">FunctionallyFit</h1>
      </div>
      <ul className="space-y-2 p-4 flex-grow">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-muted hover:text-surface-grey"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-gray-700">
        {status === "authenticated" && session?.user ? (
          <div className="flex flex-col space-y-4">
            <Link href="/profile" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user.image || undefined}
                  alt={session.user.name || ""}
                />
                <AvatarFallback>
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">
                {session.user.name}
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link href="/settings" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <form action="/api/auth/signout" method="post" className="flex-1">
                <Button type="submit" variant="outline" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
