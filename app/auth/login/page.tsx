"use client";

import {
  EnvelopeClosedIcon,
  GitHubLogoIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FieldValues, useForm } from "react-hook-form";

export default function LogInPage() {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const router = useRouter();

  const onSubmit = async (data: FieldValues) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError("Wrong Email or Password");
    } else {
      router.push("/"); // Redirect to home page or desired route
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-300 flex flex-col space-y-6 w-max p-10 rounded-xl"
      >
        <h4>Log In</h4>
        <div className="flex flex-col space-y-3">
          <label className="input input-bordered flex items-center gap-2">
            <EnvelopeClosedIcon />
            <input
              {...register("email", {
                required: "Email is required",
              })}
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
            />
          </label>
          {errors.email && (
            <p className="text-red-500 text-sm">{"£{errors.email.message}"}</p>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <LockClosedIcon />
            <input
              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              className="grow"
              placeholder="password"
              name="password"
            />
          </label>
          {errors.password && (
            <p className="text-red-500 text-sm">
              {"£{errors.password.message}"}
            </p>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          disabled={isSubmitting}
          className="btn btn-primary text-text p-3 rounded-lg"
        >
          Log In
        </button>
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
        <p className="text-sm">
          {"Don't have an account? "}
          <Link href="/auth/signup" className="link link-primary">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
