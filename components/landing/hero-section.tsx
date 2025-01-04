import Image from 'next/image';

export function HeroSection() {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="container relative flex flex-col items-center justify-between gap-12 pb-20 pt-32 md:pb-32 md:pt-40 lg:flex-row">
        <div className="flex flex-col items-start space-y-4 text-center lg:max-w-screen-sm lg:text-left">
          <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Functionally Fit
          </h1>
          <p className="max-w-[600px] text-lg text-slate-300 sm:text-xl">
            Pre-made and tailored workouts with expert guidance for time-strapped adults, busy
            parents, people with disabilities and long-term health conditions. Your journey to
            better health starts here, when and how it suits you.
          </p>
          <p className="text-xl font-semibold text-amber-500">Coming soon!</p>
        </div>
        <div className="relative aspect-[9/16] w-full max-w-[400px] overflow-hidden rounded-[32px] shadow-2xl shadow-amber-500/10 lg:max-w-[450px]">
          <div className="relative aspect-[3/6] overflow-hidden rounded-2xl">
            <Image
              alt="Founder of Functionally Fit enjoying a relaxed moment outdoors"
              className="object-cover"
              fill
              priority
              src="/images/splash.png"
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 400px, (min-width: 768px) 600px, 100vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
