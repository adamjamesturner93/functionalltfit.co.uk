import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Activity, Clock, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MailingListPopup } from "./mailingList";

export default function Home() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/20 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  FunctionallyFit: Coming Soon
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Tailored workouts and expert guidance for people with
                  disabilities, long-term health conditions, busy parents, and
                  time-strapped adults. Your journey to better health starts
                  here, on your terms.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-lg font-semibold text-primary">
                  Launching January 2025
                </p>
                <p className="text-muted-foreground">
                  Sign up for our beta release and get a 30% discount on annual
                  memberships!
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Input type="email" placeholder="Enter your email" />
                  <Button>Join Beta & Save 30%</Button>
                </div>
              </div>
            </div>
            <Image
              alt="FunctionallyFit App Interface Preview"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-2xl"
              height={550}
              src="/placeholder.svg"
              width={550}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Meet the Founder
              </h2>
              <p className="text-xl text-muted-foreground">
                FunctionallyFit was created by a certified personal trainer with
                over a decade of experience and a PhD in Exercise Physiology.
                Our founder&apos;s expertise in adaptive fitness and passion for
                inclusive health drives our mission to make fitness accessible
                to everyone.
              </p>
            </div>
            <Image
              alt="Founder of FunctionallyFit"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height={400}
              src="/placeholder.svg"
              width={400}
            />
          </div>
        </div>
      </section>

      <section
        className="w-full py-12 md:py-24 lg:py-32"
        id="why-functionallyfit"
      >
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
            Why FunctionallyFit?
          </h2>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Activity className="h-12 w-12 text-primary" />
                <h3 className="text-2xl font-bold text-center">
                  Personalised for You
                </h3>
                <p className="text-muted-foreground text-center">
                  Our AI-driven algorithm adapts workouts to your specific
                  needs, abilities, and health conditions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Clock className="h-12 w-12 text-primary" />
                <h3 className="text-2xl font-bold text-center">
                  Flexible Scheduling
                </h3>
                <p className="text-muted-foreground text-center">
                  From quick 10-minute sessions to comprehensive routines, fit
                  exercise into your busy life.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center space-y-4 p-6">
                <Heart className="h-12 w-12 text-primary" />
                <h3 className="text-2xl font-bold text-center">
                  Expert-Led Content
                </h3>
                <p className="text-muted-foreground text-center">
                  Programmes designed by certified trainers and health
                  professionals for safe, effective workouts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="features-heading"
        className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        id="features"
      >
        <div className="container px-4 md:px-6">
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12"
          >
            Fitness That Fits Your Life
          </h2>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Activity className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">
                    Adaptive Workouts
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Customised routines for all abilities and health conditions.
                    Your fitness journey, your way.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Clock className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">
                    Quick Fitness Fixes
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Effective 10-minute workouts for busy parents and
                    time-strapped adults. Every minute counts.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <Heart className="h-12 w-12 text-primary" />
                  <h3 className="text-2xl font-bold text-center">
                    Health-Focused Approach
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Programmes designed with your long-term health in mind,
                    supporting you every step of the way.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="relative aspect-video">
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="FunctionallyFit App Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
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
            className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12"
          >
            Early Bird Pricing
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Join our beta and get 30% off these prices for the first year!
          </p>
          <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
            {[
              {
                title: "Free",
                price: { monthly: "£0", annual: "£0" },
                features: [
                  "Ad-supported",
                  "Programmes capped at 2 weeks",
                  "Create your own workout (2 max)",
                  "Basic tracking",
                ],
              },
              {
                title: "Bronze",
                price: { monthly: "£4.99", annual: "£49.99" },
                features: [
                  "Ad-free experience",
                  "Create unlimited programmes and workouts",
                  "Unlimited pre-made programmes",
                  "Monthly updated nutrition recommendations",
                ],
              },
              {
                title: "Silver",
                price: { monthly: "£49.99", annual: "£499.99" },
                features: [
                  "All Bronze features",
                  "Personalised PT programmes updated monthly",
                  "Weekly updated nutrition recommendations",
                  "Priority support",
                ],
              },
              {
                title: "Gold",
                price: { monthly: "£99.99", annual: "£999.99" },
                features: [
                  "All Silver features",
                  "Personalised PT programme updated weekly",
                  "1-on-1 virtual coaching session monthly",
                  "VIP support",
                ],
              },
            ].map((plan) => {
              const monthlyPrice = parseFloat(
                plan.price.monthly.replace("£", "")
              );
              const annualPrice = parseFloat(
                plan.price.annual.replace("£", "")
              );
              const annualDiscount =
                monthlyPrice > 0
                  ? +(
                      ((monthlyPrice * 12 - annualPrice) /
                        (monthlyPrice * 12)) *
                      100
                    ).toFixed(0)
                  : 0;
              const betaAnnualPrice = (annualPrice * 0.7).toFixed(2);

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
                        <p className="text-green-600 font-semibold">
                          Save {annualDiscount}% annually
                        </p>
                      )}
                    </div>
                    {plan.title !== "Free" && (
                      <div className="mb-4">
                        <p className="text-xl font-bold text-primary">
                          £{betaAnnualPrice}
                        </p>
                        <p className="text-muted-foreground">
                          Beta price (30% off annual)
                        </p>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4">Join Beta Waitlist</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Be the First to Experience FunctionallyFit
          </h2>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto mb-8">
            Sign up for our beta release and get exclusive early access plus a
            30% discount on your first year&apos;s annual membership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-sm"
            />
            <Button>Join Beta & Save 30%</Button>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
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
                >
                  <title>YouTube</title>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="sr-only">YouTube</span>
              </Button>
            </Link>
            <Link
              href="https://tiktok.com/@functionallyfitapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="icon">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>TikTok</title>
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <span className="sr-only">TikTok</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <MailingListPopup />
    </>
  );
}
