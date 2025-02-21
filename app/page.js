"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import cabanaDark from "../public/cabana-dark-2.jpeg";
import cabanaLight from "../public/cabana-light-1.jpeg";
import ReservationDayPicker from "../components/ReservationDatePicker";
export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false); // Evită problemele de hidratare

  const user = useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Evită problemele de hidratare

  return (
    <>
      <section className="flex flex-col items-center justify-between w-full h-dvh relative">
        <Image
          src={theme === "dark" ? cabanaDark : cabanaLight}
          fill
          alt="cabana-bg"
          className="object-cover"
          // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        <div className="w-5/6 lg:w-2/3 text-center absolute left-1/2 -translate-x-1/2 top-36 tracking-wide p-6 md:p-12 bg-primary/50 dark:bg-secondary/70 rounded-lg shadow-[0_0_18px_white] dark:shadow-primary/70">
          <h1 className="[text-shadow:2px_2px_black] text-5xl md:text-8xl font-semibold tracking-[6px] text-slate-300 mb-6 italic font-greatVibes">
            Cabana
            <i className="text-5xl md:text-8xl"> D</i> Toplita
          </h1>
          <p className="text-xl md:text-3xl tracking-wide text-slate-300 font-serif [text-shadow:2px_2px_black] text-balance italic">
            Lasă în urmă agitația orașului și bucură-te de liniștea munților,
            intr-o cabana din lemn, pe malul râului Toplița.
          </p>
          <div className="">
            <ReservationDayPicker />
          </div>
        </div>
      </section>

      {/* <section className="flex flex-col items-center justify-between mt-12 h-full relative bg-orange-500">
        content
      </section> */}
    </>
  );
}
