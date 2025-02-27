import { auth } from "../app/lib/auth";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";

import { addNewUserToDB, findUserInDB, sendEmail } from "../app/lib/actions";
import supabase from "../lib/supabase";

const Navigation = async () => {
  const session = await auth();
  console.log(session?.user, session?.user?.image);

  // await searchUserInDB();

  return (
    <div className="p-2 py-6 dark:bg-slate-900/80 text-slate-900-foreground border-b bg-slate-200/70 border-slate-400/20 fixed tracking-wider top-0 w-full z-20">
      <nav className="flex items-center justify-between max-w-7xl mx-auto font-geist text-xl ">
        <Link href="/">Home logo</Link>
        <ul className="flex space-x-4">
          <li className="">
            <Link href="/gallery">Gallery</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          {session?.user?.email === "dorudia@gmail.com" && (
            <li>
              <Link href="/rezervari/toate-rezervarile">Rezervari</Link>
            </li>
          )}

          {session?.user && (
            <li>
              <Link href="/account">Account</Link>
            </li>
          )}
          {session?.user ? (
            <>
              {session?.user?.image ? (
                <Image
                  width={30}
                  height={30}
                  className="w-6 h-6 rounded-full"
                  src={session.user?.image}
                  alt={session.user?.name}
                />
              ) : (
                <span className="text-[10px] w-6 aspect-square rounded-full text-xs grid items-center justify-center bg-primary/20 p-1">
                  {session.user?.name
                    .split(" ")
                    .map((char) => char.slice(0, 1).toUpperCase())
                    .slice(0, 2)}
                </span>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link href="/login?mode=login">Login</Link>
          )}
          <ModeToggle />
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
