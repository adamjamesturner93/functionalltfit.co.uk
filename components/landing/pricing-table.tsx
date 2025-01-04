import { Check, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const APPSTORE_LINK = 'https://apps.apple.com/app/yourapp'; // Replace with actual link
const PLAYSTORE_LINK = 'https://play.google.com/store/apps/details?id=yourapp'; // Replace with actual link

interface PricingPlan {
  title: string;
  price: {
    monthly: string;
    annual: string;
  };
  features: string[];
  getInTouch: boolean;
  highlight?: boolean;
  freeForever?: boolean; // Added freeForever property
}

export function PricingSection() {
  const plans: PricingPlan[] = [
    {
      title: 'Foundation',
      price: { monthly: '£0', annual: '£0' },
      features: [
        'Ad-supported experience.',
        'Essential workout tracking tools.',
        'Access to yoga classes (10+ sessions).',
        'Access to workouts (10+ routines).',
        'One featured training programme.',
        'Progress tracking & analytics.', // Added feature
      ],
      getInTouch: false,
      highlight: false,
      freeForever: true,
    },
    {
      title: 'Premium',
      price: { monthly: '£4.99', annual: '£49.99' },
      features: [
        'Ad-free premium experience.',
        'Complete Yoga Library (25+ classes, new content regularaly).',
        'Full Workout Library (20+ workouts, new content regularaly).',
        'Curated Training Programmes (5+, new content regularaly).',
        'Basic calorie and macro split guidance.',
      ],
      getInTouch: false,
      highlight: true,
    },
    {
      title: 'Personal Coaching',
      price: { monthly: '£49.99', annual: '£499.99' },
      features: [
        'All Premium features included.',
        'Fully customised workout programme.',
        'Monthly programme review and updates.',
        'Personalised nutrition recommendations with monthly adjustments.',
        'Monthly progress review and goal setting.',
      ],
      getInTouch: true,
    },
    {
      title: 'Elite Coaching',
      price: { monthly: '£99.99', annual: '£999.99' },
      features: [
        'All Personal Coaching features included.',
        'Weekly programme optimisation.',
        'Weekly nutrition plan adjustments.',
        'Monthly 1:1 video coaching session (30 min).',
        'Unlimited coach messaging via email (in-app coming soon).',
        'Priority access to new features.',
      ],
      getInTouch: true,
    },
  ];

  return (
    <section className="w-full bg-background py-12 md:py-24 lg:py-32" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl">Choose Your Journey</h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground">
            From self-guided workouts to personalised coaching, find the perfect plan for your
            fitness goals
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          {plans.map((plan) => {
            const monthlyPrice = parseFloat(plan.price.monthly.replace('£', ''));
            const annualPrice = parseFloat(plan.price.annual.replace('£', ''));
            const annualSavings = +(monthlyPrice * 12 - annualPrice).toFixed(2);

            return (
              <Card
                key={plan.title}
                className={`relative transition-all duration-200 ${
                  plan.highlight
                    ? 'border-secondary shadow-lg hover:shadow-xl'
                    : 'hover:border-secondary/50 hover:shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-4xl font-bold">{plan.price.monthly}</p>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                  <div className="mb-6">
                    <p className="text-xl font-bold">{plan.price.annual}</p>
                    <p className="text-muted-foreground">per year</p>
                    {annualSavings > 0 && (
                      <p className="font-semibold text-emerald-500 dark:text-emerald-400">
                        Save £{annualSavings} per year
                      </p>
                    )}
                    {plan.freeForever && (
                      <p className="mt-1 font-semibold text-emerald-500 dark:text-emerald-400">
                        Free Forever
                      </p>
                    )}
                  </div>
                  <ul className="mb-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="mr-2 mt-0.5 size-5 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.getInTouch ? (
                    <div className="space-y-3">
                      <Button className="w-full transition-colors hover:bg-primary/90" asChild>
                        <a
                          href={`mailto:coaching@thechronicyogini.com?subject=Enquiry%20for%20${plan.title}`}
                        >
                          Get Started
                        </a>
                      </Button>
                      <div className="flex items-center justify-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <a
                          href="mailto:coaching@thechronicyogini.com"
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          coaching@thechronicyogini.com
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button className="w-full transition-colors hover:bg-primary/90" asChild>
                        <a href={APPSTORE_LINK} target="_blank" rel="noopener noreferrer">
                          Download on App Store
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full transition-colors hover:bg-primary/10"
                        asChild
                      >
                        <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer">
                          Get it on Google Play
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
