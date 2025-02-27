"use client";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { searchUserInDBAndSendEmail } from "../app/lib/actions";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <AuthEffects />
      {children}
    </SessionProvider>
  );
}

export function AuthEffects() {
  const { data: session } = useSession();
  useEffect(() => {
    // console.log("session", session?.user);
    async function searchUser() {
      await searchUserInDBAndSendEmail(session);
    }
    if (session?.user) {
      searchUser();
    }
  }, [session, searchUserInDBAndSendEmail]);
}
