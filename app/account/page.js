import Link from "next/link";
import { auth } from "../lib/auth";
import { signOutAction } from "../lib/actions";
import SignOutButton from "../../components/SignOutButton";

async function UserAccountPage() {
  const session = await auth();

  return (
    <section className="mt-28 max-w-7xl mx-auto p-6 border border-primary/20 shadow-xl shadow-primary/10">
      <h1 className=" text-3xl font-bold underline mb-4">Your Account</h1>
      <div>
        {session?.user && (
          <>
            <h2 className="text-2xl font-semibold">
              Welcome {session.user.name}
            </h2>
            <h4>Email: {session.user.email}</h4>
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
          <button
            className="block text-lg text-red-600 border border-red-500 rounded py-0 px-2 w-fit my-2"
            href="/api/auth/signout"
          >
            Delete Account
          </button>
        </div>
      </div>
      <div className="mt-4">
        {/* todo */}
        <h3 className="text-xl">You don't have any reservations yet</h3>
      </div>
    </section>
  );
}

export default UserAccountPage;
