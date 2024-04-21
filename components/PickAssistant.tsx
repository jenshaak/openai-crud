import { listAssistants } from "@/lib/openai";
import Link from "next/link";
import { Assistant } from "openai/resources/beta/assistants.mjs";
import React from "react";

type Props = {
  assistants: Assistant[];
};

export default function PickAssistant({ assistants }: Props) {
  return (
    <ul className="menu bg-base-100 rounded-box w-max p-4">
      {assistants.map((ass) => (
        <Link
          key={ass.id}
          href={`/chat/${ass.id}`}
          className="hover:bg-base-300 p-2 rounded-md"
        >
          {ass.name}
        </Link>
      ))}
    </ul>
  );
}
