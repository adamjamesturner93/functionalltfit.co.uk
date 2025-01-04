import { Activity, Award, Clock } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

export function WhySection() {
  return (
    <section className="w-full bg-slate-950 py-12 md:py-24 lg:py-32" id="why-functionallyfit">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter text-white sm:text-5xl">
          Why Functionally Fit?
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
              <div className="rounded-full bg-amber-500/10 p-3">
                <Activity className="size-12 text-amber-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-center text-2xl font-bold text-white">
                Your workout companion, reimagined
              </h3>
              <p className="text-center text-slate-300">
                We created the workout tracking experience we always wanted. Clean, intuitive, and
                focused on the metrics that matter - because your training deserves better than
                clunky interfaces and unnecessary features.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
              <div className="rounded-full bg-amber-500/10 p-3">
                <Clock className="size-12 text-amber-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-center text-2xl font-bold text-white">
                Tailored workouts that adapt to your life
              </h3>
              <p className="text-center text-slate-300">
                Blend powerful strength training with mobility and yoga sessions. Our app flexes to
                your schedule, energy levels, and fitness goals, ensuring you always have the
                perfect workout for today - whether you&apos;re looking to build muscle, find
                balance, or both.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
              <div className="rounded-full bg-amber-500/10 p-3">
                <Award className="size-12 text-amber-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-center text-2xl font-bold text-white">
                Expert-crafted programs and sessions
              </h3>
              <p className="text-center text-slate-300">
                Benefit from nearly a decade of experience in understanding the human body. Our
                programs are designed by a certified Personal Trainer and Yoga Teacher who brings
                real-world insight into adapting workouts when things don&apos;t go as planned.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
