import Link from "next/link";
import React from "react";

const LogoCabana = () => {
  return (
    <div className=" flex items-center rounded-2xl gap-1 font-greatVibes font-bold text-xl md:text-xl text-center">
      <img
        src="./LOGO_CASA_D.svg"
        alt="Cabana D"
        className={`w-10 h-10 md:w-28 md:h-28 dark:invert-[100%]`}
        // style={{ filter: theme === "dark" && "invert(100%)" }}
      />
      <div className="grid items-center md:-ml-[18px] pr-2 md:pr-4 md:text-2xl">
        <p className="pt-[8px]">Cabana D</p>
        <p className="hidden md:block">Toplita</p>
      </div>
    </div>
  );
};

export default LogoCabana;
