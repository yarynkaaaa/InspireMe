import { useState } from "react";

const popularTopics = [
  "Success",
  "Education",
  "Friendship",
  "Love",
  "Dreams",
  "Life",
];

export default function Generator({
  onGenerate,
  isLoading = false,
  serverError = "",
}) {
  const [topic, setTopic] = useState("");
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setTopic(e.target.value);
    setSelected(""); // ручне введення скидає вибір радіокнопки
    setError("");
  };

  const handleSelect = (value) => {
    setSelected(value);
    setTopic(value); // вибраний варіант підставляється в поле
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = topic.trim();
    if (!value) {
      setError("Please enter a topic or pick one below.");
      return;
    }
    onGenerate?.(value);
  };

  return (
    <section id="generator" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-y-12 md:grid-cols-2 md:gap-x-12 lg:gap-x-20">
          {/* Left: text */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent md:mb-4">
              Step one
            </p>
            <h2 className="mb-5 text-5xl font-bold leading-[1.1] tracking-tight text-white md:mb-6 md:text-6xl lg:text-7xl">
              What do you want to be inspired about?
            </h2>
            <p className="text-base text-white md:text-md">
              Type any topic, or pick one of the popular ones below. The AI
              writes you a quote about it.
            </p>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Your topic *
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={handleInputChange}
                placeholder="e.g. starting over"
                aria-invalid={!!error}
                className="w-full rounded-full border border-white/20 bg-secondary px-4 py-3 text-white placeholder:text-white/50 focus:border-accent focus:outline-none"
              />
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            </div>

            <fieldset className="mb-8">
              <legend className="mb-2 text-sm font-semibold text-white">
                Or pick a popular topic
              </legend>
              <div className="flex flex-col gap-3">
                {popularTopics.map((item) => (
                  <label
                    key={item}
                    className="flex cursor-pointer items-center gap-3 text-base text-white"
                  >
                    <input
                      type="radio"
                      name="popular-topic"
                      value={item}
                      checked={selected === item}
                      onChange={() => handleSelect(item)}
                      className="peer sr-only"
                    />
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 bg-secondary transition-colors peer-checked:border-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-checked:[&>span]:scale-100">
                      <span className="size-2.5 scale-0 rounded-full bg-accent transition-transform" />
                    </span>
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
            >
              {isLoading ? "Generating..." : "Generate Quote"}
            </button>
            {serverError && (
              <p className="mt-3 text-sm text-red-400">{serverError}</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
