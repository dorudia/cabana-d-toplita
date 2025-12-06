// SEO pentru pagina Home
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
