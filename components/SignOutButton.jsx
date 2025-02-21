"use client";
import { signOutAction } from "../app/lib/actions";
import React from "react";

const SignOutButton = () => {
  return (
    <form
      action={() => {
        if (window.confirm("Are you sure you want to logout?")) {
          signOutAction();
        }
      }}
    >
      <button
      //   onClick={() => signOutAction()} // asa nu merge
      >
        Logout
      </button>
    </form>
  );
};

export default SignOutButton;
