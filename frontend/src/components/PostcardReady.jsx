export default function PostcardReady({
  onDownload,
  onGenerateAgain,
  isDownloading = false,
  error = "",
}) {
  return (
    <section
      id="postcard-ready"
      className="bg-neutral-800 px-[5%] py-16 md:py-24 lg:py-28"
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent md:mb-4">
            Ready to go
          </p>
          <h2 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-6xl">
            Your postcard is ready
          </h2>
          <p className="text-sm text-white md:text-base">
            Download it as an image and post it wherever you like, or start
            again with a new topic and let the AI write you another one.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
            >
              {isDownloading ? "Preparing..." : "Download Postcard"}
            </button>
            <button
              type="button"
              onClick={onGenerateAgain}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent md:text-base"
            >
              Generate Again
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  );
}
