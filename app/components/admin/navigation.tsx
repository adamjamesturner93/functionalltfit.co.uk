"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Video,
  Dumbbell,
  Clipboard,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Members", icon: Users },
  { href: "/admin/content/yoga-videos", label: "Yoga Videos", icon: Video },
  { href: "/admin/content/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/admin/content/workouts", label: "Workouts", icon: Clipboard },
  { href: "/admin/content/programmes", label: "Programmes", icon: Clipboard },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">
          FunctionallyFit Admin
        </h1>
      </div>
      <ul className="space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-2 p-2 rounded-md ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
