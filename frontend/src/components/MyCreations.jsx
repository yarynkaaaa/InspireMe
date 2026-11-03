import { Download, Trash2 } from "lucide-react";

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MyCreations({ creations, onDelete }) {
  const handleDownload = (item) => {
    const link = document.createElement("a");
    link.download = `inspireme-${item.id}.jpg`;
    link.href = item.image;
    link.click();
  };

  return (
    <section
      id="my-creations"
      className="bg-neutral-800 px-[5%] py-16 md:py-24 lg:py-28"
    >
      <div className="container mx-auto">
        <div className="mb-12 max-w-md md:mb-18 lg:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent md:mb-4">
            Saved
          </p>
          <h2 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-6xl">
            My creations
          </h2>
          <p className="text-sm text-white md:text-base">
            Postcards you make appear here, ready to download again or delete
            when you are finished with them.
          </p>
        </div>

        {creations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-white/70">
            Nothing here yet. Download a postcard and it will be saved in this
            list.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {creations.map((item) => (
              <li key={item.id}>
                <div className="mb-3 overflow-hidden rounded-3xl">
                  <img
                    src={item.image}
                    alt={`${item.topic} postcard`}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-white">
                    {capitalize(item.topic)} · {item.style}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      aria-label="Download again"
                      className="rounded-full border border-white/20 p-2 text-white transition-colors hover:border-accent hover:text-accent"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      aria-label="Delete postcard"
                      className="rounded-full border border-white/20 p-2 text-white transition-colors hover:border-red-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
