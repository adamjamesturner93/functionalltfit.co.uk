import { ReactNode } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">FunctionallyFit</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="/" className="text-sm font-medium underline-offset-4 hover:underline">
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium underline-offset-4 hover:underline">
              Blog
            </Link>
            <Link href="#" className="text-sm font-medium underline-offset-4 hover:underline">
              About
            </Link>
            <Link href="#" className="text-sm font-medium underline-offset-4 hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t">
        <div className="container flex w-full shrink-0 flex-col items-center gap-2 px-4 py-6 sm:flex-row md:px-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FunctionallyFit. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:ml-auto sm:gap-6">
            <Link href="#" className="text-xs underline-offset-4 hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs underline-offset-4 hover:underline">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
