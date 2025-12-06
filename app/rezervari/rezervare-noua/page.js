import React from "react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { addNewReservationToDB } from "../../../lib/actions";
import { Textarea } from "../../../@/components/ui/textarea";
import { auth } from "../../lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../@/components/ui/select";

const RezervareNoua = async () => {
  const session = await auth();

  return (
    <section className=" mt-[77px]">
      <form action={addNewReservationToDB} className="mt-4">
        <div className="grid gap-6 md:max-w-[500px] mx-auto">
          <div className="relative mt-8 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="text-3xl relative z-10 bg-background px-2 text-muted-foreground">
              Reverva Acum
            </span>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                className=""
                id="fullName"
                type="text"
                name="name"
                placeholder="Full Name"
                required
                defaultValue={session?.user?.name}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className=""
                id="email"
                type="email"
                name="email"
                placeholder="Your email"
                defaultValue={session?.user?.email}
                required
              />
            </div>
            <div className="grid gap-2 grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="adulti">Adulti</Label>
                <select
                  name="adulti"
                  id="adulti"
                  className="p-2 border-[1px] border-prymary focus:ring-1 focus:ring-primary/30 rounded-md"
                >
                  {Array(8)
                    .fill()
                    .map((_, i) => (
                      <option key={i}>{i + 1}</option>
                    ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="copii">Copii</Label>
                <select
                  name="cpoii"
                  id="copii"
                  className="p-2 border-[1px] border-prymary focus:ring-1 focus:ring-primary/30 rounded-md"
                >
                  {Array(8)
                    .fill()
                    .map((_, i) => (
                      <option key={i}>{i + 1}</option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observatii">Observatii</Label>
              <Textarea
                id="observatii"
                name="observatii"
                placeholder="Observaii"
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full">
              Rezerva
            </Button>
          </div>
          {/* {error && (
            <p className="text-center p-2 text-sm bg-destructive text-destructive-foreground">
              {error}
            </p>
          )} */}
          {/* <div className="text-center text-sm">
            {mode === "login" ? "Don't have an account? " : ""}
            <a
              href={
                mode === "login" ? "/login?mode=signup" : "/login?mode=login"
              }
              className="underline underline-offset-4"
            >
              {mode === "login" ? "Sign up" : "Back to login"}
            </a>
          </div> */}
        </div>
      </form>
    </section>
  );
};

export default RezervareNoua;
