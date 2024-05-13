"use client";

import { registerUser } from "@/lib/actions/userActions";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { useFormState } from "react-dom";

export default function SignUpPage() {
  const initialState = {
    message: "",
  };
  const [formState, formAction] = useFormState(registerUser, initialState);
  //hello
  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        action={formAction}
        className="bg-base-300 flex flex-col space-y-6 w-max p-10 rounded-xl"
      >
        <h4>Register</h4>
        <div className="flex flex-col space-y-3">
          <label className="input input-bordered flex items-center gap-2">
            <PersonIcon fill="true" />
            <input
              type="text"
              className="grow"
              name="username"
              placeholder="Username"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <EnvelopeClosedIcon />
            <input
              type="email"
              className="grow"
              name="email"
              placeholder="Email"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <LockClosedIcon />
            <input
              type="password"
              className="grow"
              name="password"
              placeholder="password"
            />
          </label>
        </div>
        {formState.message && (
          <p className="text-red-500 text-sm text-center mt-4">
            {formState.message}
          </p>
        )}
        <button className="btn btn-primary p-3 rounded-lg">Register</button>
        <div className="divider text-textSoft">Or use Github or Google</div>
        <button
          type="button"
          className="btn"
          onClick={() => {
            signIn("github");
          }}
        >
          <GitHubLogoIcon /> Github
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            signIn("google");
          }}
        >
          <FontAwesomeIcon icon={faGoogle} />
          Google
        </button>
        <p>
          Already have an account?{" "}
          <Link href="/auth/signin" className="link link-primary">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}
