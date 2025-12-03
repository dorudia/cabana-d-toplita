// "use client";
// import {
//   Coffee,
//   Fence,
//   FishSymbol,
//   SquareParking,
//   TvMinimal,
//   Wifi,
// } from "lucide-react";
// import { useTheme } from "next-themes";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import ReservationDayPicker from "../components/ReservationDatePicker";
// import cabanaDark from "../public/cabana-dark-2.jpeg";
// import cabanaLight from "../public/cabana-light-1.jpeg";
// export default function Home() {
//   const { theme } = useTheme();
//   const [mounted, setMounted] = useState(false); // Evită problemele de hidratare

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   const facilitys = [
//     {
//       name: "Parcare Privata",
//       description: "Parcare privata, cu 4 locuri de parcare.",
//       icon: <SquareParking width={100} height={100} />,
//     },
//     {
//       name: "Wifi",
//       description: "Wifi gratuit.",
//       icon: <Wifi width={100} height={100} />,
//     },
//     {
//       name: "TV",
//       description: "Tv in fiecare camera si living.",
//       icon: <TvMinimal width={100} height={100} />,
//     },
//     {
//       name: "Bucatarie",
//       description:
//         "Bucatarie cu aparat de cafea, aragaz, frigider si cuptor cu microunde.",
//       icon: <Coffee width={100} height={100} />,
//     },
//     {
//       name: "Terasa",
//       description: "Terasa, gratar, ceaun",
//       icon: <Fence width={80} height={80} />,
//     },
//     {
//       name: "Pescuit",
//       description:
//         "Pecuit pe raul Toplița care trece la mica distanta de cabana.",
//       icon: <FishSymbol width={100} height={100} />,
//     },
//   ];

//   if (!mounted) return null; // Evită problemele de hidratare

//   return (
//     <>
//       <section className="flex flex-col items-center justify-between w-full h-dvh relative">
//         <Image
//           src={theme === "dark" ? cabanaDark : cabanaLight}
//           fill
//           alt="cabana-bg"
//           className={`object-cover absolute top-0 left-0 w-full h-full z-[-1]
//   ${theme === "light" ? "md:object-center object-[20%_50%]" : "object-center"}
// `}
//           // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           priority
//         />
//         <div className="w-5/6 lg:w-2/3 text-center absolute left-1/2 -translate-x-1/2 top-40 tracking-wide px-2 py-12 md:p-14 bg-primary/50 dark:bg-secondary/70 rounded-lg shadow-[0_0_18px_white] dark:shadow-primary/70 z-[2]">
//           <h1 className="[text-shadow:2px_2px_black] text-5xl md:text-8xl font-semibold tracking-[6px] text-slate-300 mb-6 italic font-greatVibes">
//             Cabana D Toplita
//           </h1>
//           <p className="text-xl md:text-3xl tracking-wide text-slate-300 font-geist [text-shadow:2px_2px_black] text-balance italic">
//             Lasă în urmă agitația orașului și bucură-te de liniștea munților,
//             intr-o cabana din lemn, pe malul râului Toplița.
//           </p>
//           <div className="inline-block shadow-lg shadow-black/30 absolute left-1/2 -translate-x-1/2 bottom-[-40px]">
//             <ReservationDayPicker />
//           </div>
//         </div>
//       </section>

//       <section className="mx-auto flex flex-col items-center justify-between h-full relative z-0 bg-stone-9500 py-32 ">
//         <div
//           className="wrapper-lines absolute top-0 left-0 w-full h-full z-[2]"
//           style={{
//             background: `linear-gradient(to right, #ffffff15 1px, transparent 1px),
//           linear-gradient(to bottom, #00000015 1px, transparent 1px)`,
//             backgroundSize: "5px 5px",
//           }}
//         ></div>

//         <div className="max-w-7xl w-full">
//           {/* <h2 className="text-3xl font-bold text-center py-16">Facilitati</h2> */}
//           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-8 mx-4 relative z-[2]">
//             {facilitys.map((facility, index) => (
//               <li
//                 key={index}
//                 className="flex flex-col items-center justify-center p-8 rounded-lg shadow-[0_0_22px] shadow-primary/30 border border-primary/20 bg-gradient-to-tr from-secondary/70 via-transparent to-primary/20"
//               >
//                 {facility.icon}
//                 <h3 className="text-3xl font-semibold my-4 font-geist">
//                   {facility.name}
//                 </h3>
//                 <p className="text-lg text-center">{facility.description}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </section>
//     </>
//   );
// }

// no "use client" aici ❌

// SEO pentru pagina Home
// ⚠️ FARA "use client" aici

// ----- SEO -----
export const metadata = {
  title: "Cabana D Toplița - Cazare la munte",
  description:
    "Cabana din lemn pe malul râului Toplița. Rezervă acum și bucură-te de liniștea munților.",
};

import CabanaHero from "@/components/CabanaHero"; // component client
import {
  Coffee,
  Fence,
  FishSymbol,
  SquareParking,
  TvMinimal,
  Wifi,
} from "lucide-react";
import { Suspense } from "react";

const facilitys = [
  {
    name: "Parcare Privata",
    description: "Parcare privata, cu 4 locuri de parcare.",
    icon: <SquareParking width={100} height={100} />,
  },
  {
    name: "Wifi",
    description: "Wifi gratuit.",
    icon: <Wifi width={100} height={100} />,
  },
  {
    name: "TV",
    description: "Tv in fiecare camera si living.",
    icon: <TvMinimal width={100} height={100} />,
  },
  {
    name: "Bucatarie",
    description: "Bucătărie complet utilată.",
    icon: <Coffee width={100} height={100} />,
  },
  {
    name: "Terasa",
    description: "Terasa, grătar, ceaun.",
    icon: <Fence width={80} height={80} />,
  },
  {
    name: "Pescuit",
    description: "Pescuit pe râul Toplița.",
    icon: <FishSymbol width={100} height={100} />,
  },
];

export default function Home() {
  return (
    <>
      {/* HERO 1:1 EXACT */}
      <Suspense fallback={<div>Loading...</div>}>
        <CabanaHero />
      </Suspense>
      {/* FACILITIES – EXACT styling păstrat */}
      <section className="mx-auto flex flex-col items-center justify-between h-full relative z-0 bg-stone-9500 py-32 min-h-[500px] ">
        <div
          className="wrapper-lines absolute top-0 left-0 w-full h-full z-[2] min-h-[500px]"
          style={{
            background: `linear-gradient(to right, #ffffff15 1px, transparent 1px),
          linear-gradient(to bottom, #00000015 1px, transparent 1px)`,
            backgroundSize: "5px 5px",
          }}
        ></div>

        <div className="max-w-7xl w-full">
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-8 mx-4 relative z-[2]">
            {facilitys.map((facility, index) => (
              <li
                key={index}
                className="flex flex-col items-center justify-center p-8 rounded-lg shadow-[0_0_22px] shadow-primary/30 border border-primary/20 bg-gradient-to-tr from-secondary/70 via-transparent to-primary/20"
              >
                {facility.icon}
                <h2 className="text-3xl font-semibold my-4 font-geist">
                  {facility.name}
                </h2>
                <p className="text-lg text-center">{facility.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
