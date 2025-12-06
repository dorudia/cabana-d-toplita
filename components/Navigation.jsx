"use client";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import SignOutButton from "./SignOutButton";
import HamburgerMenu from "./HamburgerMenu";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import LogoCabana from "./LogoCabana";
import { usePathname } from "next/navigation";
import { UserIcon } from "lucide-react";

const Navigation = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href) => {
    if (!pathname) return false;
    // pentru homepage exact "/"
    if (href === "/") return pathname === "/";
    // pentru restul, exact match fără query/hash
    return pathname.split(/[?#]/)[0] === href;
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  let navUlClasses = isOpen
    ? "flex flex-col absolute top-[58px] left-0 w-[100%] pt-16 bg-secondary h-screen items-center justify-top space-y-4 mx-auto font-geist text-xl "
    : "hidden md:flex items-center justify-between  space-x-7 mx-auto text-2xl ";

  let linkClasses = "rounded-md border  hover:border hover:border-primary/40";

  return (
    <div className="p-2 py-1 dark:bg-slate-900/40 text-slate-900-foreground bg-slate-200/70 backdrop-blur-sm border-slate-400/20 fixed tracking-wider top-0 w-full z-20">
      <nav className="flex items-center justify-between max-w-7xl mx-auto font-geist text-xl ">
        <Link
          href="/"
          className={`${linkClasses} ${isLinkActive("/") ? " border-1 border-primary/40" : "border-transparent"}`}
        >
          <LogoCabana />
        </Link>
        <ul className={navUlClasses + "font-serif italic"}>
          <li
            className={linkClasses + "flex md:hidden"}
            onClick={() => setIsOpen(false)}
          >
            <Link className="px-2 py-1" href="/">
              Home
            </Link>
          </li>
          <li
            onClick={() => setIsOpen(false)}
            className={`${linkClasses} ${isLinkActive("/gallery") ? " border-1 border-primary/40" : "border-transparent"}`}
          >
            <Link className="px-2 py-1" href="/gallery">
              Galerie Foto
            </Link>
          </li>
          <li
            onClick={() => setIsOpen(false)}
            className={`${linkClasses} ${isLinkActive("/about") ? " border-1 border-primary/40" : "border-transparent"}`}
          >
            <Link className="px-2 py-1" href="/about">
              Despre
            </Link>
          </li>
          <li
            onClick={() => setIsOpen(false)}
            className={`${linkClasses} ${isLinkActive("/contact") ? " border-1 border-primary/40" : "border-transparent"}`}
          >
            <Link className="px-2 py-1" href="/contact">
              Contact
            </Link>
          </li>
          {/* {session?.user && (
            <li onClick={() => setIsOpen(false)}>
              <Link href="/account">Account</Link>
            </li>
          )} */}
          {(session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL_1 ||
            session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL_2) && (
            <li
              onClick={() => setIsOpen(false)}
              className={`${linkClasses} ${isLinkActive("/admin") ? " border-1 border-primary/40" : "border-transparent"}`}
            >
              <Link className="px-2 py-1" href="/admin">
                Admin
              </Link>
            </li>
          )}
        </ul>
        <div className="flex items-center space-x-4 font-mono lg:min-w-[225px] justify-end">
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
                    <UserIcon size={16} className="text-primary/70" />
                  </span>
                </Link>
              )}
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
