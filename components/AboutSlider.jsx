"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const images = Array.from(
  { length: 20 },
  (_, i) => `/slide-site/cabana-${i + 1}.jpeg`
);

export default function AboutSlider() {
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (pause) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [pause, index]);

  return (
    <div
      className="relative w-full aspect-[16/9] overflow-hidden rounded-xl shadow-lg"
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Image
          src={images[index]}
          alt="Cabana D"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={images[index] + "?w=10&blur=200"}
        />
      </motion.div>

      {/* Buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-stone-300 px-3 py-1 rounded-full aspect-square"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-stone-300 px-3 py-1 rounded-full aspect-square"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
