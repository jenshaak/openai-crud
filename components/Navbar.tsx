"use client";

import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const links = [
  {
    title: "create",
    link: "/create",
  },
  {
    title: "chat",
    link: "/chat",
  },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  return (
    <nav className="bg-transparent flex justify-between p-3">
      {session && (
        <div className="avatar placeholder">
          <div className="bg-neutral text-primary rounded-full w-14 text-xl">
            <span>{session?.user.email[0].toUpperCase()}</span>
          </div>
        </div>
      )}
      {session && (
        <button
          className="btn btn-primary"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            });
          }}
        >
          <ExitIcon />
          Log Out
        </button>
      )}
    </nav>
  );
}
