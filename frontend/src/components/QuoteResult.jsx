export default function QuoteResult({
  quote,
  topic,
  onRegenerate,
  isLoading = false,
}) {
  if (!quote) return null;

  return (
    <section id="quote" className="bg-plum px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent md:mb-4">
            Your quote
          </p>
          <blockquote className="mb-5 text-4xl font-bold leading-[1.15] tracking-tight text-white md:mb-6 md:text-6xl lg:text-7xl">
            {quote}
          </blockquote>
          <p className="text-base text-white md:text-md">
            Written for your topic: {topic}. Generate again for a different one,
            or pick a backdrop to sit behind it below.
          </p>
          <div className="mt-6 flex justify-center md:mt-8">
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
            >
              {isLoading ? "Generating..." : "Generate another quote"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
