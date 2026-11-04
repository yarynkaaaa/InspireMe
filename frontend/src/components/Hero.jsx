import { ArrowRight } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

export default function Hero() {
  return (
    <section id="hero" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        <div className="mb-12 text-center md:mb-16 lg:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent md:mb-4 md:text-sm">
            AI Motivation Generator
          </p>

          <h1 className="mb-5 whitespace-nowrap text-[length:min(7vw,6rem)] font-bold leading-[1.1] tracking-tight text-white md:mb-6">
            Find Your Inspiration
          </h1>

          <p className="mx-auto max-w-xl text-sm text-white md:text-base">
            Create beautiful motivational postcards with the power of AI.
          </p>

          <div className="mt-6 flex justify-center md:mt-8">
            <a
              href="#generator"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent md:text-base"
            >
              Create Your Postcard
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-secondary">
          <img
            src={`${BASE}hero.png`}
            alt="Abstract purple 3D shape"
            className="aspect-[4/3] w-full object-cover md:aspect-video"
          />
        </div>
      </div>
    </section>
  );
}
