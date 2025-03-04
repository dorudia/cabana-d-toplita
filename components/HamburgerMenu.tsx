"use client";
import React from "react";

const HamburgerMenu = ({ isOpen, setIsOpen }) => {
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="flex flex-col w-6 h-auto justify-between md:hidden"
    >
      <div
        className={
          isOpen
            ? " my-[3px] h-[2px] bg-primary transition-transform duration-300 ease-in-out translate-y-2 rotate-45 origin-center"
            : " my-[3px] h-[2px] bg-primary transition-transform duration-300 ease-in-out"
        }
      ></div>
      <div
        className={
          isOpen
            ? "my-[3px] h-[2px] bg-primary opacity-0 transition-opacity duration-300 ease-in-out "
            : "my-[3px] h-[2px] bg-primary opacity-100 transition-opacity duration-300 ease-in-out"
        }
      ></div>
      <div
        className={
          isOpen
            ? "my-[3px] h-[2px] bg-primary transition-transform duration-300 -translate-y-2 ease-in-out -rotate-45 origin-center"
            : "my-[3px] h-[2px] bg-primary transition-transform duration-300 ease-in-out"
        }
      ></div>
    </div>
  );
};

export default HamburgerMenu;
