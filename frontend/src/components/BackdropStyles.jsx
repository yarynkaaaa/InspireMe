import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { backdrops } from "../data/backdrops";

export default function BackdropStyles({ onSelect }) {
  const [active, setActive] = useState(null);

  // Close on Escape and lock page scroll while the modal is open
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="image-styles" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-lg md:mb-18 lg:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent md:mb-4">
            Step two
          </p>
          <h2 className="mb-5 font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-6xl">
            Choose the backdrop for your quote
          </h2>
          <p className="text-base text-white">
            Every topic comes with imagery to match its mood. Tap a style to
            open it full frame.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {backdrops.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => setActive(style)}
              className="group text-left focus:outline-none"
            >
              <div className="mb-3 overflow-hidden rounded-3xl border border-transparent transition-colors group-hover:border-accent group-focus-visible:border-accent">
                <img
                  src={style.src}
                  alt={style.label}
                  loading="lazy"
                  className="aspect-[3/2] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-sm font-semibold text-white">
                {style.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Full-frame view */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.label} backdrop`}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-black/90 p-4 md:p-8"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white transition-colors hover:border-accent hover:text-accent md:right-8 md:top-8"
          >
            <X size={24} />
          </button>

          <img
            src={active.src}
            alt={active.label}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[75vh] max-w-full rounded-2xl object-contain"
          />

          {onSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(active);
                setActive(null);
              }}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent md:text-base"
            >
              Use this backdrop
            </button>
          )}
        </div>
      )}
    </section>
  );
}
