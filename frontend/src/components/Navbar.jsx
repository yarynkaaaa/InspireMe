import { useState } from "react";
import { Menu, X } from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const links = [
  { label: "Generator", href: "#generator" },
  { label: "Image styles", href: "#image-styles" },
  { label: "Postcard editor", href: "#postcard-editor" },
  { label: "My creations", href: "#my-creations" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background px-[5%] pt-4">
      <nav className="mx-auto max-w-7xl rounded-[2rem] border border-white/20 bg-background/80 backdrop-blur">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-6 px-5 md:min-h-[5.5rem] lg:px-10">
          {/* Logo */}
          <a href={`${BASE}`} className="flex shrink-0 items-center">
            <img
              src={`${BASE}logo.png`}
              alt="Inspire Me"
              className="h-12 w-auto md:h-16"
            />
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-lg font-medium text-white transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#generator"
              className="rounded-full bg-white px-6 py-3 text-lg font-medium text-black transition-colors hover:bg-accent"
            >
              Create your postcard
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="p-2 text-white lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="flex flex-col gap-1 border-t border-white/20 px-5 pb-6 pt-4 lg:hidden">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl py-3 text-lg font-medium text-white transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#generator"
              onClick={() => setIsOpen(false)}
              className="mt-3 rounded-full bg-white px-6 py-3 text-center text-lg font-medium text-black transition-colors hover:bg-accent"
            >
              Create your postcard
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
