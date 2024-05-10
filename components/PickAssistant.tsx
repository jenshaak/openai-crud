"use client";

import { deleteAssistant, listAssistants } from "@/lib/openai";
import { TrashIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Assistant } from "openai/resources/beta/assistants.mjs";
import React from "react";

type Props = {
  assistants: Assistant[];
  apiKey?: string;
};

export default function PickAssistant({ assistants, apiKey }: Props) {
  return (
    <ul className="flex flex-col gap-1">
      {assistants.map((ass) => (
        <div
          key={ass.id}
          className="bg-base-100 pl-3 pr-1 rounded-md flex justify-between items-center group hover:bg-primary/25"
        >
          <Link href={`/chat/${ass.id}`} className="w-full py-3">
            <strong>{ass.name}</strong>
          </Link>
          {apiKey && (
            <>
              <TrashIcon
                className="group-hover:block hidden h-7 w-7 p-1 rounded-md cursor-pointer hover:bg-red-500 hover:text-white"
                onClick={() => {
                  const modal = document.getElementById("my_modal_1");
                  if (modal instanceof HTMLDialogElement) {
                    modal.showModal();
                  }
                }}
              />
              <dialog id={"my_modal_1"} className="modal">
                <div className="modal-box flex flex-col items-center justify-center gap-10 w-96 h-48">
                  <p className="text-center">
                    Are you sure you want to delete your assistant?
                  </p>
                  <div className="flex gap-4">
                    <form method="dialog">
                      <button className="btn btn-primary text-info-content">
                        No, keep
                      </button>
                    </form>
                    <form action={deleteAssistant}>
                      <input type="hidden" name="id" value={ass.id} />
                      <input type="hidden" name="apiKey" value={apiKey} />
                      <button
                        type="submit"
                        className="btn btn-error text-error-content"
                      >
                        Yes, delete
                      </button>
                    </form>
                  </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </>
          )}
        </div>
      ))}
    </ul>
  );
}
