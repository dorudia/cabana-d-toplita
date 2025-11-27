"use client";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import SignOutButton from "./SignOutButton";

import HamburgerMenu from "./HamburgerMenu";
import { useEffect, useState } from "react";

const Navigation = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  // console.log("session form navbar 12:", session?.user);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  // if (isOpen) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "auto";
  // }

  let navUlClasses = isOpen
    ? "flex flex-col absolute top-[77px] left-0 w-[100%] pt-16 bg-secondary h-screen items-center justify-top space-y-4 mx-auto font-geist text-xl "
    : "hidden md:flex items-center justify-between  space-x-4 mx-auto font-geist text-xl ";
  console.log("navUlClasses", navUlClasses);

  return (
    <div className="p-2 py-6 dark:bg-slate-900/80 text-slate-900-foreground border-b bg-slate-200/70 backdrop-blur-sm border-slate-400/20 fixed tracking-wider top-0 w-full z-20">
      <nav className="flex items-center justify-between max-w-7xl mx-auto font-geist text-xl ">
        <Link
          className="font-greatVibes font-bold text-xl md:text-2xl text-center  cursor-pointer"
          onClick={() => setIsOpen(false)}
          href="/"
        >
          Cabana D
        </Link>
        <ul className={navUlClasses}>
          <li className="flex md:hidden" onClick={() => setIsOpen(false)}>
            <Link href="/">Home</Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link href="/gallery">Gallery</Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link href="/about">About</Link>
          </li>
          <li onClick={() => setIsOpen(false)}>
            <Link href="/contact">Contact</Link>
          </li>
          {/* {session?.user && (
            <li onClick={() => setIsOpen(false)}>
              <Link href="/account">Account</Link>
            </li>
          )} */}
          {(session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL_1 ||
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL_2) && (
            <li onClick={() => setIsOpen(false)}>
              <Link href="/rezervari/toate-rezervarile">Rezervari</Link>
            </li>
          )}
        </ul>
        <div className="flex items-center space-x-4">
          {session?.user ? (
            <>
              {session?.user?.image ? (
                <Link href="/account">
                  <Image
                    width={30}
                    height={30}
                    className="w-6 h-6 rounded-full cursor-pointer"
                    src={session.user?.image}
                    alt={session.user?.name}
                    priority
                  />
                </Link>
              ) : (
                <Link href="/account">
                  <span className="text-[10px] w-6 aspect-square rounded-full text-xs grid items-center justify-center bg-primary/20 p-1">
                    {session.user?.name
                      .split(" ")
                      .map((char) => char.slice(0, 1).toUpperCase())
                      .slice(0, 2)}
                  </span>
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link href="/login?mode=login">Login</Link>
          )}
          <ModeToggle />
          <HamburgerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
