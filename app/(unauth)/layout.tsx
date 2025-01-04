import { ReactNode } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/75">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            Functionally Fit
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link href="/" className="text-sm text-slate-200 transition-colors hover:text-white">
              Home
            </Link>
            <Link
              href="#features"
              className="text-sm text-slate-200 transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-slate-200 transition-colors hover:text-white"
            >
              Pricing
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>
      <footer className="w-full bg-slate-950 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex w-full flex-col items-center justify-between text-sm text-slate-400 md:flex-row">
            <p>© 2025 Functionally Fit. All rights reserved.</p>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <Link href="/terms" className="transition-colors hover:text-amber-500">
                Terms of Service
              </Link>
              <Link href="/privacy" className="transition-colors hover:text-amber-500">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
