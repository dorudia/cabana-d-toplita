"use client";
import { signOutAction } from "../app/lib/actions";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/@/components/ui/dialog";
import { Button } from "@/@/components/ui/button";

const SignOutButton = () => {
  return (
    //   <form
    //     action={() => {
    //       if (window.confirm("Are you sure you want to logout?")) {
    //         signOutAction();
    //       }
    //     }}
    //   >
    //     <button
    //     //   onClick={() => signOutAction()} // asa nu merge
    //     >
    //       Logout
    //     </button>
    //   </form>
    <Dialog>
      <DialogTrigger asChild>
        <button
          size="sm"
          variant="destructive"
          className="!ml-auto hover:opacity-75 transition"
        >
          Logout
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90%]  md:max-w-[50%] w-full font-geist"
        aria-describedby="descriere-dialog"
      >
        <DialogHeader>
          <DialogTitle className="mb-2 font-geist">
            Esti sigur ca vrei sa te deconectezi?
          </DialogTitle>
          <DialogDescription>Confirmare deconectare</DialogDescription>
        </DialogHeader>
        <Button
          className="font-bold px-8 capitalize bg-red-700 hover:bg-red-800 text-white w-fit mx-auto"
          onClick={() => signOutAction()}
        >
          Logout
        </Button>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              // ref={closeBtnRef}
              type="button"
              variant="secondary"
              className="!py-1 !px-4 border hover:border hover:border-primary/30 absolute bottom-1 right-1"
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutButton;
