"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import cabanaDark from "@/public/cabana-dark-2.jpeg";
import cabanaLight from "@/public/cabana-light-1.jpeg";

const ReservationDayPicker = dynamic(
  () => import("../components/ReservationDatePicker"),
  { ssr: false }
);

export default function CabanaHero() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // 🔹 Placeholder pentru CLS
  if (!mounted) {
    return <div className="w-full h-[100vh] min-h-[600px] relative"></div>;
  }

  return (
    <section className="flex flex-col items-center justify-between w-full h-[100vh] min-h-[600px] relative">
      <Image
        src={theme === "dark" ? cabanaDark : cabanaLight}
        fill
        alt="cabana-bg"
        className={`object-cover absolute top-0 left-0 w-full h-full z-[-1]
          ${theme === "light" ? "md:object-center object-[20%_50%]" : "object-center"}
        `}
        priority
        quality={75}
      />
      <div className="w-5/6 lg:w-2/3 text-center absolute left-1/2 -translate-x-1/2 top-40 tracking-wide px-2 py-12 md:p-14 bg-primary/50 dark:bg-secondary/70 rounded-lg shadow-[0_0_18px_white] dark:shadow-primary/70 z-[2]">
        <h1 className="[text-shadow:2px_2px_black] text-5xl md:text-8xl font-semibold tracking-[6px] text-slate-300 mb-6 italic font-greatVibes">
          Cabana D Toplita
        </h1>
        <p className="text-xl md:text-3xl tracking-wide text-slate-300 font-geist [text-shadow:2px_2px_black] text-balance italic">
          Lasă în urmă agitația orașului și bucură-te de liniștea munților,
          într-o cabană din lemn, pe malul râului Toplița.
        </p>
        <div className="inline-block shadow-lg shadow-black/30 absolute left-1/2 -translate-x-1/2 bottom-[-40px]">
          <ReservationDayPicker />
        </div>
      </div>
    </section>
  );
}
