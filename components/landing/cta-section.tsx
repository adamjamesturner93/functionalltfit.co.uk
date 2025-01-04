import { ArrowRight } from 'lucide-react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const APPSTORE_LINK = 'https://apps.apple.com/app/functionallyfit'; // Replace with actual link
const PLAYSTORE_LINK = 'https://play.google.com/store/apps/details?id=functionallyfit'; // Replace with actual link

export function CTASection() {
  return (
    <>
      <section className="w-full bg-slate-950 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Start your functional transformation
                <span className="block text-amber-500">with Functionally Fit</span>
              </h2>
              <p className="mx-auto max-w-[700px] text-slate-400 md:text-xl">
                Join thousands of members who have already transformed their lives through
                functional fitness. Your journey to a stronger, more capable you starts here.
              </p>
            </div>

            <Card className="w-full max-w-sm border-slate-800 bg-slate-900/50">
              <CardContent className="space-y-4 p-4">
                <div className="space-y-2">
                  <Button className="w-full bg-amber-500 text-slate-900 hover:bg-amber-600" asChild>
                    <a href={APPSTORE_LINK}>
                      Download on App Store
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-slate-800 hover:bg-slate-800"
                    asChild
                  >
                    <a href={PLAYSTORE_LINK}>
                      Get it on Google Play
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <div className="w-full bg-slate-900 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h3 className="text-xl font-semibold text-white">Connect With Us</h3>
            <div className="flex justify-center space-x-6">
              <Link
                href="https://instagram.com/functionallyfit"
                className="text-slate-400 transition-colors hover:text-amber-500"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="size-6" />
              </Link>
              <Link
                href="https://facebook.com/functionallyfit"
                className="text-slate-400 transition-colors hover:text-amber-500"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="size-6" />
              </Link>
              <Link
                href="https://youtube.com/functionallyfit"
                className="text-slate-400 transition-colors hover:text-amber-500"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="size-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
