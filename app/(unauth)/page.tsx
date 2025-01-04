import {
  Activity,
  Award,
  BarChart,
  Calendar,
  Check,
  Clock,
  Dumbbell,
  Heart,
  Hourglass,
  LineChart,
  MessageCircle,
  Pizza,
  SpaceIcon as Yoga,
  Target,
  Timer,
  Utensils,
  Video,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CTASection } from '@/components/landing/cta-section';
import { HeroSection } from '@/components/landing/hero-section';
import { FounderSection } from '@/components/landing/meet-the-founder';
import { PricingSection } from '@/components/landing/pricing-table';
import { WhySection } from '@/components/landing/why-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// import { MailingListPopup } from './mailingList';
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
        {icon}
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />

      <FounderSection />

      <WhySection />

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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Activity className="size-12 text-secondary" />}
              title="Adaptive Workouts"
              description="Customised routines for all abilities and health conditions. Your fitness journey, your way."
            />
            <FeatureCard
              icon={<Hourglass className="size-12 text-secondary" />}
              title="Quick Workouts"
              description="Effective workouts in less than 20 minutes for busy schedules. Every minute counts towards your health goals."
            />
            <FeatureCard
              icon={<Heart className="size-12 text-secondary" />}
              title="Health-Focused Approach"
              description="Programmes designed with your long-term health in mind, supporting you every step of the way."
            />
            <FeatureCard
              icon={<Dumbbell className="size-12 text-secondary" />}
              title="On-Demand Workouts"
              description="Access a library of diverse workouts anytime, anywhere. From beginner to advanced levels."
            />
            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  className="size-12 text-secondary"
                  fill="currentColor"
                >
                  <path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm208-480q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                </svg>
              }
              title="Yoga Classes"
              description="Enhance flexibility and mindfulness with our curated selection of yoga sessions."
            />
            <FeatureCard
              icon={<Pizza className="size-12 text-secondary" />}
              title="Nutrition Guidance"
              description="Receive personalised nutrition recommendations to complement your fitness routine."
            />
            <FeatureCard
              icon={<Calendar className="size-12 text-secondary" />}
              title="Personalised Programmes"
              description="Get tailored fitness programmes designed by expert trainers, updated regularly to match your progress."
            />
            <FeatureCard
              icon={<MessageCircle className="size-12 text-secondary" />}
              title="Coach Interaction"
              description="Benefit from regular check-ins and dedicated coach messaging for personalised support."
            />
            <FeatureCard
              icon={<Video className="size-12 text-secondary" />}
              title="1:1 Coaching Sessions"
              description="Elevate your fitness with monthly one-on-one video coaching sessions (Elite plan)."
            />
            <FeatureCard
              icon={<LineChart className="size-12 text-secondary" />}
              title="Progress Tracking"
              description="Visualise your fitness journey with comprehensive progress tracking and analytics."
            />
            <FeatureCard
              icon={<Target className="size-12 text-secondary" />}
              title="Goal Setting"
              description="Set and achieve your fitness goals with guided goal-setting sessions and regular reviews."
            />
          </div>
        </div>
      </section>

      <PricingSection />

      <CTASection />
      {/* <MailingListPopup /> */}
    </>
  );
}
