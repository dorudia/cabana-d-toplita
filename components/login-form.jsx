"use client";

import {
  sendEmail,
  signInWithCredentials,
  signInWithFacebook,
  signInWithGoogle,
} from "../app/lib/actions";
import { signIn } from "next-auth/react";

import { addNewUserToDB, findUserInDB, checkUserPassword } from "@/lib/actions";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { cn } from "../lib/utils";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { signIn } from "@/app/lib/auth";‚

function isValidEmail(email) {
  // validare simplă, verifică că are format corect
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginForm({ className, ...props }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const router = useRouter();

  const [error, setError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");

  // useEffect(() => {
  //   console.log("session", session);
  //   async function searchUser() {
  //     await searchUserInDB(session);
  //   }
  //   if (session?.user) {
  //     searchUser();
  //   }
  // }, [session, searchUserInDB]);

  // ----------------------------
  // LOGIN
  // ----------------------------
  async function handleLogin(e) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const user = await checkUserPassword(email, password);
      if (!user) {
        setError("Incorrect email or password");
        return;
      }

      // login NextAuth cu redirect: true
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/",
      });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.target);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    try {
      // 1️⃣ Creează user
      const user = await addNewUserToDB(name, email, password);

      // 2️⃣ Login automat cu NextAuth
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password, // parola originală, NextAuth se ocupă de comparație cu hash
      });

      if (res?.error) {
        setError(res.error || "Login after signup failed");
        return;
      }

      // 3️⃣ Redirect homepage
      await signIn("credentials", {
        redirect: true, // forțează redirect + setare cookie
        email,
        password,
        callbackUrl: "/", // unde vrei să fie redirect după login
      });
    } catch (err) {
      setError(err.message);
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage("");
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la trimiterea emailului");
      } else {
        setForgotMessage(data.message);
        setForgotEmail("");
      }
    } catch (err) {
      setError("Eroare la conectarea cu serverul");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-xl dark:bg-slate-900 dark:shadow-lg dark:shadow-slate-500/50 border border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {mode === "signup" ? "Sign up" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            Login with your Facebook or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={mode === "login" ? handleLogin : handleSignUp}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  onClick={() => signInWithFacebook()}
                  type="button"
                  variant="outline"
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <path
                      d="M20.16 2.72c-1.724-.107-3.68.196-5.173 1.493-1.6 1.404-2.08 3.2-2.133 4.907H8.8v4.693h4.053V29.6h5.333V13.813h4.124l.64-4.693h-4.764c.053-1.013.228-1.96.853-2.533.676-.627 1.493-.68 2.4-.693.853-.02 1.707 0 2.56 0V2.88c-1.085-.073-2.187-.147-3.307-.16z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Facebook
                </Button>

                <Button
                  onClick={() => {
                    signInWithGoogle();
                  }}
                  type="button"
                  href="/api/auth/signin"
                  variant="outline"
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  {mode === "login" ? "Or login with" : "Sign up with"}
                </span>
              </div>
              <div className="grid gap-6">
                {mode === "signup" && (
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      className=""
                      id="fullName"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className=""
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Your email"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Your Password</Label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>
                {error && (
                  <p className="text-center p-2 text-sm bg-destructive/50">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full">
                  {mode === "signup" ? "Sign up" : "Login"}
                </Button>
              </div>

              <div className="text-center text-sm">
                {mode === "login" ? "Don't have an account? " : ""}
                <a
                  href={
                    mode === "login"
                      ? "/login?mode=signup"
                      : "/login?mode=login"
                  }
                  className="underline underline-offset-4"
                >
                  {mode === "login" ? "Sign up" : "Back to login"}
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog Forgot Password */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-xl dark:bg-slate-900">
            <CardHeader>
              <CardTitle>Resetare parolă</CardTitle>
              <CardDescription>
                Introduceți adresa de email pentru a primi instrucțiuni de
                resetare.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="forgotEmail">Email</Label>
                  <Input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={forgotLoading}
                  />
                </div>
                {forgotMessage && (
                  <p className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    {forgotMessage}
                  </p>
                )}
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                    {error}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail("");
                      setForgotMessage("");
                      setError(null);
                    }}
                    className="flex-1"
                    disabled={forgotLoading}
                  >
                    Anulează
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "Se trimite..." : "Trimite"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
