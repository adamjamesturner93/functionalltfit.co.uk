'use client';

import { Clipboard, Dumbbell, LayoutDashboard, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Members', icon: Users },
  { href: '/admin/content/yoga-videos', label: 'Yoga Videos', icon: Video },
  { href: '/admin/content/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/admin/content/workouts', label: 'Workouts', icon: Clipboard },
  { href: '/admin/content/programmes', label: 'Programmes', icon: Clipboard },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-surface-grey shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-foreground">Functionally Fit Admin</h1>
      </div>
      <ul className="space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center space-x-2 rounded-md p-2 ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted hover:bg-muted hover:text-surface-grey'
                }`}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
