'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import {
  Dumbbell,
  GlassWater,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  UserIcon,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { logout } from '../actions/auth';

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
  const [open, setOpen] = useState(false);

  const logoutButton = (
    <form action={logout}>
      <Button variant="ghost" size="icon" type="submit">
        <LogOut className="size-4" />
        <span className="sr-only">Log out</span>
      </Button>
    </form>
  );

  const NavContent = () => (
    <div className="space-y-2 py-2">
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
            onClick={() => setOpen(false)}
          >
            <Link href={item.href}>
              <item.icon className="mr-2 size-4" />
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
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden h-screen w-64 flex-col gap-4 border-r bg-card/50 backdrop-blur lg:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Heart className="size-6 text-primary" />
            <span>Functionally Fit</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-2">
          <NavContent />
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
              <AvatarFallback>
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.membershipPlan} Plan</p>
            </div>
            {logoutButton}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex h-14 items-center border-b bg-card/50 px-4 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="size-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b px-4 py-2">
              <SheetTitle>
                <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                  <Heart className="size-6 text-primary" />
                  <span>Functionally Fit</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 px-2">
              <NavContent />
            </ScrollArea>
            <div className="border-t p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                  <AvatarFallback>
                    {user?.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.membershipPlan} Plan</p>
                </div>
                {logoutButton}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/50 backdrop-blur lg:hidden">
        <nav className="grid h-16 grid-cols-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                pathname === item.href
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary',
              )}
            >
              <item.icon className="size-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
