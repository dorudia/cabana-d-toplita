"use client";
import { motion } from "framer-motion";
import cabanaDark from "../../public/cabana-dark-1.jpg";
import Image from "next/image";
import { useState, useEffect } from "react";
import { set } from "mongoose";
import ReservationDayPickeer from "../../components/ReservationDatePicker";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = Array.from(
  { length: 20 },
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
    <div className="max-w-5xl mx-auto px-4 py-10 mt-24">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-5xl font-great-vibes text-center mb-6 font-greatVibes"
      >
        Povestea Cabanei D
      </motion.h1>

      {/* Image + Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6 items-center p-1"
      >
        <p className="leading-relaxed mx-auto text-center font-greatVibes text-2xl md:text-4xl max-w-[90%]">
          Departe de zgomotul orașelor, cabana noastră oferă un refugiu perfect
          pentru familii, grupuri sau oricine are nevoie de relaxare si să
          respire aer curat.
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
      </motion.div>
      <div className="w-fit mx-auto mt-6">
        <ReservationDayPickeer />
      </div>
    </div>
  );
}
