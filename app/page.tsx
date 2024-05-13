"use client";

import CreateChatForm from "@/components/CreateChatForm";
import PickAssistant from "@/components/PickAssistant";
import { listAssistants } from "@/lib/openai";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { options } from "./api/auth/[...nextauth]";
import { addApiKey, fetchUser } from "@/lib/actions/userActions";
import { EnterIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/typings";
import { Assistant } from "openai/resources/beta/assistants.mjs";

export default function Home() {
  const [exampleGpts, setExampleGpts] = useState<Assistant[] | null>(null);
  const [usersGpts, setUsersGpts] = useState<Assistant[] | null>(null);
  const [apiKey, setApiKey] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    async function getData() {
      const ex = await listAssistants();
      setExampleGpts(ex);
      if (session) {
        const key = await fetchUser(session?.user.email);
        setApiKey(key);
        const data = await listAssistants(apiKey);
        setUsersGpts(data);
      }
    }
    getData();
  }, [session]);

  return (
    <main className="flex flex-col items-center gap-10 pb-10">
      <div className="text-5xl font-bold text-black dark:text-white text-center">
        Create and Use
        <div className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-fuchsia-600 text-center">
          {"Your Personal GPT's"}
        </div>
      </div>
      <section className="flex gap-10">
        <div className="bg-base-300 w-80 h-[500px] overflow-y-auto rounded-xl p-5 space-y-5">
          <h3>{"Test example GPT's"}</h3>
          {exampleGpts && <PickAssistant assistants={exampleGpts} />}
        </div>
        <div className="bg-base-300 w-80 h-[500px] overflow-y-auto rounded-xl p-5 space-y-5">
          <h3>Create your custom GPT</h3>

          {session ? (
            apiKey !== "" ? (
              <CreateChatForm apiKey={apiKey} />
            ) : (
              <form action={addApiKey}>
                <input
                  type="hidden"
                  name="userEmail"
                  value={session?.user.email}
                />
                <input
                  type="text"
                  className="input input-bordered"
                  name="apiKey"
                  placeholder="OpenAI API Key"
                />
                <button className="btn btn-primary" type="submit">
                  Add Key
                </button>
              </form>
            )
          ) : (
            <div className="w-full flex justify-center">
              <Link href="/auth/login" className="btn btn-primary">
                <EnterIcon />
                Log In
              </Link>
            </div>
          )}
        </div>
        <div className="bg-base-300 w-80 h-[500px] overflow-y-auto rounded-xl p-5 space-y-5">
          <h3>{"Chat with your GPT's"}</h3>
          {session ? (
            usersGpts ? (
              <PickAssistant assistants={usersGpts} apiKey={apiKey} />
            ) : (
              <p>No GPT yet!</p>
            )
          ) : (
            <div className="w-full flex justify-center">
              <Link href="/auth/login" className="btn btn-primary">
                <EnterIcon />
                Log In
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
