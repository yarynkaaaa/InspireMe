const BASE = import.meta.env.BASE_URL;

const links = [
  { label: "Generator", href: "#generator" },
  { label: "Image styles", href: "#image-styles" },
  { label: "Postcard editor", href: "#postcard-editor" },
  { label: "My creations", href: "#my-creations" },
  { label: "How it works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="bg-neutral-800 px-[5%] py-12 md:py-16"
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">

          {/* Logo */}
          <a href={BASE} className="shrink-0">
            <img
              src={`${BASE}logo.png`}
              alt="Inspire Me"
              className="h-12 w-auto md:h-14"
            />
          </a>

          {/* Navigation */}
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-semibold text-white transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright and Developer */}
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/20 pt-6 md:mt-14 md:flex-row md:items-center">
          <p className="text-sm text-white">
            InspireMe. All rights reserved.
          </p>

          <p className="text-sm text-white">
            Developer: Yaryna Romaniuk.
          </p>
        </div>
      </div>
    </footer>
  );
}