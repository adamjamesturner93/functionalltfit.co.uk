import Image from 'next/image';

export function FounderSection() {
  return (
    <section className="w-full bg-secondary/5 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Meet the Founder
            </h2>
            <p className="max-w-[600px] text-xl text-slate-300">
              Functionally Fit was created by Shruti, a certified personal trainer and yoga teacher
              with a PhD in Rehabilitation. Shruti&apos;s expertise in adaptive fitness and passion
              for inclusive health drives our mission to make fitness accessible to everyone.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-[3/4]">
            <Image
              alt="Founder of Functionally Fit enjoying a relaxed moment outdoors"
              className="object-cover"
              fill
              priority
              src="/images/image.png"
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 400px, (min-width: 768px) 600px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
