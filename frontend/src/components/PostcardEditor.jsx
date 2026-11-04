import { useCallback, useEffect, useRef, useState } from "react";
import { Shuffle } from "lucide-react";
import { backdrops } from "../data/backdrops";

const API_URL = "https://inspire-me-jet.vercel.app";

const fonts = [
  { id: "serif", label: "Serif", className: "font-serif" },
  { id: "sans", label: "Sans", className: "font-sans" },
];

const colors = [
  { id: "light", label: "Light", text: "text-white", overlay: "bg-black/40" },
  { id: "dark", label: "Dark", text: "text-black", overlay: "bg-white/40" },
];

const pill = (active) =>
  `rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
    active
      ? "border-accent bg-accent text-black"
      : "border-white/20 text-white hover:border-accent"
  }`;

export default function PostcardEditor({
  quote,
  backdrop,
  onBackdropChange,
  cardRef,
}) {
  const [fontId, setFontId] = useState("serif");
  const [colorId, setColorId] = useState("light");
  const [photo, setPhoto] = useState(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const latestRequest = useRef(0);

  const font = fonts.find((f) => f.id === fontId);
  const color = colors.find((c) => c.id === colorId);

  const loadPhoto = useCallback(async (style, excludeId = "") => {
    const requestId = ++latestRequest.current;
    setIsPhotoLoading(true);

    try {
      const params = new URLSearchParams({
        style: style.id,
        exclude: excludeId,
      });

      // Отримуємо фотографію з Vercel backend
      const res = await fetch(`${API_URL}/api/backdrop?${params}`);

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();

      if (requestId !== latestRequest.current) return;

      setPhoto({
        id: data.id,

        // Завантажуємо фото через backend proxy
        // Це допомагає уникнути CORS-проблем під час експорту
        src: `${API_URL}/api/image-proxy?url=${encodeURIComponent(data.image)}`,

        photographer: data.photographer,
        photographerUrl: data.photographer_url,
        unsplashUrl: data.unsplash_url,
      });
    } catch (err) {
      console.error("Failed to load backdrop photo:", err);

      if (requestId === latestRequest.current) {
        setPhoto(null);
      }
    } finally {
      if (requestId === latestRequest.current) {
        setIsPhotoLoading(false);
      }
    }
  }, []);

  // Завантажуємо нове фото, коли змінюється категорія фону
  useEffect(() => {
    loadPhoto(backdrop);
  }, [backdrop, loadPhoto]);

  const imageSrc = photo?.src ?? backdrop.src;

  return (
    <section id="postcard-editor" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        {/* Postcard preview */}
        <div
          ref={cardRef}
          className="relative mx-auto aspect-[4/3] w-full max-w-5xl overflow-hidden rounded-2xl bg-secondary md:aspect-video"
        >
          <img
            src={imageSrc}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isPhotoLoading ? "opacity-60" : "opacity-100"
            }`}
          />

          <div className={`absolute inset-0 ${color.overlay}`} />

          <div className="relative flex h-full items-center justify-center p-6 text-center md:p-12">
            <p
              className={`max-w-3xl text-2xl font-bold leading-[1.2] tracking-tight md:text-4xl lg:text-5xl ${font.className} ${color.text}`}
            >
              {quote || "Your quote will appear here."}
            </p>
          </div>
        </div>

        {/* Photo credit */}
        <div className="mx-auto mt-3 flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-white/70">
            {photo ? (
              <>
                Photo by{" "}
                <a
                  href={photo.photographerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-accent"
                >
                  {photo.photographer}
                </a>{" "}
                on{" "}
                <a
                  href={photo.unsplashUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-accent"
                >
                  Unsplash
                </a>
              </>
            ) : (
              "\u00A0"
            )}
          </p>

          <button
            type="button"
            onClick={() => loadPhoto(backdrop, photo?.id)}
            disabled={isPhotoLoading}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Shuffle size={16} />
            {isPhotoLoading ? "Loading..." : "Shuffle photo"}
          </button>
        </div>

        {/* Controls */}
        <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-6 md:mt-10 md:flex-row md:flex-wrap md:items-start md:gap-12">
          {/* Font */}
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Font</p>

            <div className="flex gap-2">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFontId(f.id)}
                  aria-pressed={fontId === f.id}
                  className={pill(fontId === f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Text colour */}
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Text colour</p>

            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  aria-pressed={colorId === c.id}
                  className={pill(colorId === c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <p className="mb-2 text-sm font-semibold text-white">Background</p>

            <div className="flex flex-wrap gap-2">
              {backdrops.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => onBackdropChange(b)}
                  aria-label={b.label}
                  aria-pressed={backdrop.id === b.id}
                  className={`overflow-hidden rounded-xl border-2 transition-colors ${
                    backdrop.id === b.id
                      ? "border-accent"
                      : "border-transparent hover:border-white/40"
                  }`}
                >
                  <img
                    src={b.src}
                    alt=""
                    className="h-12 w-[4.5rem] object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
