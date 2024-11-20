'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Dumbbell, GlassWater, Heart, LayoutDashboard, LogOut, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@prisma/client';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Workouts',
    href: '/workouts',
    icon: Dumbbell,
  },
  {
    title: 'Yoga',
    href: '/yoga',
    icon: GlassWater,
  },
  {
    title: 'Programmes',
    href: '/programmes',
    icon: Heart,
  },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Profile',
    href: '/profile',
    icon: UserIcon,
  },
];

export function Navigation({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col gap-4 border-r bg-card/50 backdrop-blur">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Heart className="h-6 w-6 text-primary" />
          <span>FunctionallyFit</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-2">
          <div className="px-2">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main
            </h2>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-primary/10 font-medium text-primary',
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="px-2">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Settings
            </h2>
            <div className="space-y-1">
              {bottomNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    pathname === item.href && 'bg-primary/10 font-medium text-primary',
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.membershipPlan} Plan</p>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/logout">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
