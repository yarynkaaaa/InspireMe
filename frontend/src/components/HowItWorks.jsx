import { Lightbulb, Pencil, Download } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: Lightbulb,
    title: "Pick your topic",
    text: "Type anything you want to be inspired about. Six popular topics are one tap away if you would rather choose.",
  },
  {
    number: "2",
    icon: Pencil,
    title: "The AI writes the quote",
    text: "A fresh quote is written for that exact topic, and a background image is matched to its mood. Not happy with it? Generate another.",
  },
  {
    number: "3",
    icon: Download,
    title: "Make it yours and download",
    text: "Choose the font, the text colour and the background, then save the finished postcard as an image to post or send.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-18 lg:mb-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-accent md:mb-4">
            How it works
          </p>
          <h2 className="mb-5 font-heading text-5xl font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-6xl">
            Three steps from one word to a finished postcard
          </h2>
          <p className="text-sm text-white md:text-base">
            No prompt writing and no design work. You bring the topic, the AI
            does the rest.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-x-8 lg:gap-x-12">
          {steps.map(({ number, icon: Icon, title, text }, index) => (
            <li key={number}>
              {/* Number + connecting line */}
              <div
                className={`mb-6 flex items-center ${
                  index < steps.length - 1 ? "md:-mr-8 lg:-mr-12" : ""
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-heading text-sm font-bold text-accent">
                  {number}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-px flex-1 bg-white/20 md:block"
                />
              </div>

              {/* Icon */}
              <span
                aria-hidden="true"
                className="mb-5 flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent md:mb-6"
              >
                <Icon size={24} />
              </span>

              <h3 className="mb-2 font-heading text-xl font-bold text-white md:text-2xl">
                {title}
              </h3>
              <p className="text-sm text-white md:text-base">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
