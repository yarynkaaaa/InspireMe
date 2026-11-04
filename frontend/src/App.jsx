import { useRef, useState } from "react";
import { toJpeg, toPng } from "html-to-image";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Generator from "./components/Generator";
import QuoteResult from "./components/QuoteResult";
import BackdropStyles from "./components/BackdropStyles";
import PostcardEditor from "./components/PostcardEditor";
import PostcardReady from "./components/PostcardReady";
import MyCreations from "./components/MyCreations";
import HowItWorks from "./components/HowItWorks";
import About from "./components/About";
import Footer from "./components/Footer";
import useCreations from "./hooks/useCreations";
import { backdrops } from "./data/backdrops";

// Підключення до backend на Vercel
const API_URL = "https://inspire-me-jet.vercel.app";
const QUOTE_ENDPOINT = `${API_URL}/api/generate`;

export default function App() {
  const cardRef = useRef(null);
  const [topic, setTopic] = useState("");
  const [quote, setQuote] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [backdrop, setBackdrop] = useState(backdrops[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const {
    creations,
    add: addCreation,
    remove: removeCreation,
  } = useCreations();

  const generateQuote = async (newTopic) => {
    setTopic(newTopic);
    setIsLoading(true);
    setQuoteError("");

    try {
      const res = await fetch(QUOTE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: newTopic,
          previous: quote,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }

      const data = await res.json();

      if (!data.quote) {
        throw new Error("Empty response from server");
      }

      setQuote(data.quote);

      setTimeout(() => {
        document
          .getElementById("quote")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Quote generation error:", err);
      setQuoteError("Could not generate a quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = "inspireme-postcard.png";
      link.href = dataUrl;
      link.click();

      const thumb = await toJpeg(cardRef.current, {
        pixelRatio: 1,
        quality: 0.85,
        cacheBust: true,
      });

      addCreation({
        id: Date.now(),
        topic: topic.toLowerCase(),
        style: backdrop.label,
        image: thumb,
      });
    } catch (err) {
      console.error(err);
      setDownloadError("Could not create the image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerateAgain = () => {
    document
      .getElementById("generator")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <Hero />

      <Generator
        onGenerate={generateQuote}
        isLoading={isLoading}
        serverError={quoteError}
      />

      <QuoteResult
        quote={quote}
        topic={topic.toLowerCase()}
        onRegenerate={() => generateQuote(topic)}
        isLoading={isLoading}
      />

      <BackdropStyles onSelect={setBackdrop} />

      <PostcardEditor
        quote={quote}
        backdrop={backdrop}
        onBackdropChange={setBackdrop}
        cardRef={cardRef}
      />

      {quote && (
        <PostcardReady
          onDownload={handleDownload}
          onGenerateAgain={handleGenerateAgain}
          isDownloading={isDownloading}
          error={downloadError}
        />
      )}

      <MyCreations creations={creations} onDelete={removeCreation} />

      <HowItWorks />
      <About />
      <Footer />
    </>
  );
}
