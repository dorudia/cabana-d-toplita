import Link from "next/link";
import { auth } from "../lib/auth";
import { signOutAction } from "../lib/actions";
import SignOutButton from "../../components/SignOutButton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/@/components/ui/dialog";

import { Button } from "@/@/components/ui/button";
import { use } from "react";

async function UserAccountPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <section className="text-center py-10 text-xl mt-[100px]">
        You are not logged in. Please log in to access your account.
      </section>
    );
  }

  return (
    <div className="min-h-[calc(100vh-280px)]">
      <section className="mt-40 max-w-7xl mx-auto p-6 font-geist  border border-primary/20 shadow-[0_0_30px_0] shadow-primary/25">
        <h1 className=" text-3xl font-bold mb-4">Your Account</h1>
        <div>
          {session?.user && (
            <>
              <h2 className="text-2xl font-semibold mb-3">
                Welcome {session.user.name}
              </h2>
              <h4 className="mb-3">Email: {session.user.email}</h4>
            </>
          )}
          <div className="flex gap-4">
            {/* <button
            onClick={() => signOutAction()}
            className="block text-lg text-blue-500 border border-blue-500 rounded py-0 px-2 w-fit my-2"
          >
            Logout
          </button> */}
            <span className="block text-lg text-blue-500 border border-blue-500 rounded py-0 px-2 w-fit my-2">
              <SignOutButton />
            </span>

            {/* <button
            className="block text-lg text-red-600 border border-red-500 rounded py-0 px-2 w-fit my-2"
            href="/api/auth/signout"
          >
            Delete Account
          </button> */}
          </div>
        </div>
        <div className="mt-4">
          {/* todo */}
          {/* <h3 className="text-xl">You don't have any reservations yet</h3> */}
        </div>
      </section>
    </div>
  );
}

export default UserAccountPage;
