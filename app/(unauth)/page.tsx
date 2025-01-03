import { Activity, Check, Clock, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// import { MailingListPopup } from './mailingList';

export default function Home() {
  return (
    <>
      <section className="w-full bg-gradient-to-b from-primary/20 to-background py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Functionally Fit
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Tailored workouts and expert guidance for people with disabilities, long-term
                  health conditions, busy parents, and time-strapped adults. Your journey to better
                  health starts here, on your terms.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-semibold text-brand-orange">Coming soon!</p>
              </div>
            </div>
            <Image
              alt="Functionally Fit App Interface Preview"
              className="mx-auto aspect-auto h-full overflow-hidden rounded-xl object-cover object-center shadow-2xl sm:w-1/3 lg:order-last"
              height={1000}
              width={1000}
              src="/images/splash.png"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary/5 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Meet the Founder
              </h2>
              <p className="text-xl text-muted-foreground">
                Functionally Fit was created by a certified personal trainer with over a decade of
                experience and a PhD in Exercise Physiology. Our founder&apos;s expertise in
                adaptive fitness and passion for inclusive health drives our mission to make fitness
                accessible to everyone.
              </p>
            </div>
            <Image
              alt="Founder of Functionally Fit"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height={400}
              src="/images/image.png"
              width={400}
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32" id="why-functionallyfit">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
            Why Functionally Fit?
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Activity className="size-12 text-secondary" />
                <h3 className="text-center text-2xl font-bold">Personalised for You</h3>
                <p className="text-center text-muted-foreground">
                  Our AI-driven algorithm adapts workouts to your specific needs, abilities, and
                  health conditions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Clock className="size-12 text-secondary" />
                <h3 className="text-center text-2xl font-bold">Flexible Scheduling</h3>
                <p className="text-center text-muted-foreground">
                  From quick 10-minute sessions to comprehensive routines, fit exercise into your
                  busy life.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="size-12 text-secondary" />
                <h3 className="text-center text-2xl font-bold">Expert-Led Content</h3>
                <p className="text-center text-muted-foreground">
                  Programmes designed by certified trainers and health professionals for safe,
                  effective workouts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="w-full bg-secondary/5 py-12 md:py-24 lg:py-32"
        id="features"
      >
        <div className="container px-4 md:px-6">
          <h2
            id="features-heading"
            className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl"
          >
            Fitness That Fits Your Life
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Activity className="size-12 text-secondary" />
                <h3 className="text-center text-2xl font-bold">Adaptive Workouts</h3>
                <p className="text-center text-muted-foreground">
                  Customised routines for all abilities and health conditions. Your fitness journey,
                  your way.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Clock className="size-12 text-secondary" />
                <h3 className="text-center text-2xl font-bold">Quick Fitness Fixes</h3>
                <p className="text-center text-muted-foreground">
                  Effective 10-minute workouts for busy parents and time-strapped adults. Every
                  minute counts.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="size-12 text-secondary" />
                <h3 className="text-center text-2xl font-bold">Health-Focused Approach</h3>
                <p className="text-center text-muted-foreground">
                  Programmes designed with your long-term health in mind, supporting you every step
                  of the way.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="pricing-heading"
        className="w-full py-12 md:py-24 lg:py-32"
        id="pricing"
      >
        <div className="container px-4 md:px-6">
          <h2
            id="pricing-heading"
            className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl"
          >
            Early Bird Pricing
          </h2>
          <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              {
                title: 'Free',
                price: { monthly: '£0', annual: '£0' },
                features: [
                  'Ad-supported',
                  'Basic tracking',
                  'On demand yoga videos',
                  'On demand workouts',
                ],
                getInTouch: false,
              },
              {
                title: 'Bronze',
                price: { monthly: '£4.99', annual: '£49.99' },
                features: [
                  'Ad-free experience',
                  'Premium on demand yoga videos',
                  'Premium workouts',
                  'Pre-made programmes',
                ],
                getInTouch: false,
              },
              {
                title: 'Silver',
                price: { monthly: '£49.99', annual: '£499.99' },
                features: [
                  'All Bronze features',
                  'Personalised PT programmes reviewed monthly',
                  'Monthly reviewed nutrition recommendations',
                  'Priority support',
                ],
                getInTouch: true,
              },
              {
                title: 'Gold',
                price: { monthly: '£99.99', annual: '£999.99' },
                features: [
                  'All Silver features',
                  'Personalised PT programme reviewed weekly',
                  'Weekly reviewed nutrition recommendations',
                  'VIP support',
                ],
                getInTouch: true,
              },
            ].map((plan) => {
              const monthlyPrice = parseFloat(plan.price.monthly.replace('£', ''));
              const annualPrice = parseFloat(plan.price.annual.replace('£', ''));
              const annualDiscount =
                monthlyPrice > 0
                  ? +(((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100).toFixed(0)
                  : 0;

              return (
                <Card key={plan.title}>
                  <CardHeader>
                    <CardTitle>{plan.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-3xl font-bold">{plan.price.monthly}</p>
                      <p className="text-muted-foreground">per month</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-xl font-bold">{plan.price.annual}</p>
                      <p className="text-muted-foreground">per year</p>
                      {annualDiscount > 0 && (
                        <p className="font-semibold text-green-600">
                          Save {annualDiscount}% annually
                        </p>
                      )}
                    </div>
                    {plan.title !== 'Free' && (
                      <div className="mb-4">
                        <p className="text-xl font-bold text-secondary">£{annualPrice}</p>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 size-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.getInTouch ? (
                      <Button className="mt-4 w-full">Get in Touch (Doesn&apos;t work yet)</Button>
                    ) : (
                      <Button className="mt-4 w-full">Download now (Doesn&apos;t work yet)</Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-secondary/5 py-12 md:py-24 lg:py-32">
        <div className="container px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Start your functional transformation now with Functionally Fit
          </h2>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button variant={'secondary'} className="mt-4 h-16 w-full md:w-2/3 lg:w-1/2">
              Download now (Doesn&apos;t work yet)
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
            Connect With Us
          </h2>
          <div className="flex justify-center space-x-6">
            <Link
              href="https://instagram.com/functionallyfitapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted-foreground"
                  stroke="currentColor"
                >
                  <title>Instagram</title>
                  <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
            </Link>
            <Link
              href="https://facebook.com/functionallyfitapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted-foreground"
                  stroke="currentColor"
                >
                  <title>Facebook</title>
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
            </Link>
            <Link
              href="https://youtube.com/functionallyfitapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-muted-foreground"
                  stroke="currentColor"
                >
                  <title>YouTube</title>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="sr-only">YouTube</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* <MailingListPopup /> */}
    </>
  );
}
