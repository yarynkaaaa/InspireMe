export default function About() {
  return (
    <section id="about" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        <div className="mb-12 overflow-hidden rounded-2xl md:mb-16 lg:mb-20">
          <img
            src="/styles/aesthetic.jpg"
            alt="A desk with a framed mountain picture, a notebook, a mug and a glowing lamp"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover md:aspect-[16/7]"
          />
        </div>

        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent md:mb-4">
            About InspireMe
          </p>
          <h2 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-5xl">
            A generator built for the days you need a nudge
          </h2>
          <p className="text-sm text-white md:text-base">
            InspireMe turns a single topic into a motivational quote and a
            matching image, then hands you the finished postcard. The AI does
            the writing and the art direction; you only decide what you need to
            hear. There is no account to create and nothing to install.
          </p>
          <div className="mt-6 md:mt-8">
            <a
              href="#generator"
              className="inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent md:text-base"
            >
              Create your postcard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
