"use client";
import { motion } from "framer-motion";
import cabanaDark from "../../public/cabana-dark-1.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { set } from "mongoose";

const images = Array.from(
  { length: 21 },
  (_, i) => `/slide-site/cabana-${i + 1}.jpeg`
);

export default function AboutPage() {
  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false); // oprește autoplay la hover

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (pause) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [pause, index]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-28">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-great-vibes text-center mb-6"
      >
        Povestea Cabanei D
      </motion.h1>

      {/* Image + Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6 items-center p-1"
      >
        <p className="leading-relaxed text-lg">
          Departe de zgomotul orașelor, cabana noastră oferă un refugiu perfect
          pentru familii, cupluri sau oricine are nevoie să respire aer curat.
        </p>
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }} // 👉 tranzitie smooth
          >
            <Image
              src={images[index]}
              alt="Cabana D"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded-lg"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-1 rounded-lg"
          >
            ›
          </button>
        </div>
      </motion.div>

      {/* CTA */}
      <div className="text-center mt-10">
        <a
          href="/rezervari"
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:scale-105 transition font-medium shadow-lg"
        >
          Vezi disponibilitatea 🗓️
        </a>
      </div>
    </div>
  );
}
