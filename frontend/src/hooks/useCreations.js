import { useEffect, useState } from "react";

const KEY = "inspireme-creations";
const MAX_ITEMS = 12;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export default function useCreations() {
  const [creations, setCreations] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(creations));
    } catch (err) {
      // сховище переповнене або недоступне, список лишається в памʼяті
      console.warn("Could not persist creations", err);
    }
  }, [creations]);

  const add = (item) =>
    setCreations((prev) => [item, ...prev].slice(0, MAX_ITEMS));

  const remove = (id) =>
    setCreations((prev) => prev.filter((c) => c.id !== id));

  return { creations, add, remove };
}
