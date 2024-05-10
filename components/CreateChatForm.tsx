"use client";

import { addApiKey } from "@/lib/actions/userActions";
import { createOrUpdateAssistant } from "@/lib/openai";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

type Props = {
  apiKey: string;
};

export default function CreateChatForm({ apiKey }: Props) {
  const [state, formAction] = useFormState(createOrUpdateAssistant, {
    message: "",
    errors: undefined,
    fieldValues: {
      apiKey: "",
      name: "",
      instructions: "",
      model: "",
      id: undefined,
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "success") {
      formRef.current?.reset();
    }
  }, [state]);
  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 w-full"
    >
      <div className="flex flex-col space-y-3">
        <input type="hidden" name="apiKey" value={apiKey} />
        <div className="w-full">
          <input
            type="text"
            className={`input ${
              state.errors?.name ? "input-error" : "input-bordered"
            } w-full`}
            placeholder="name..."
            name="name"
            defaultValue={state.fieldValues.name}
          />
          <p className="text-sm text-error">{state.errors?.name}</p>
        </div>
        <div className="w-full">
          <textarea
            className={`textarea ${
              state.errors?.name ? "textarea-error" : "textarea-bordered"
            } w-full`}
            name="instructions"
            placeholder="instructions..."
            defaultValue={state.fieldValues.instructions}
          />
          <p className="text-sm text-error">{state.errors?.instructions}</p>
        </div>
        <div className="w-full">
          <select
            name="model"
            defaultValue={state.fieldValues.model}
            className={`select w-full max-w-xs ${
              state.errors?.name ? "select-error" : "select-bordered"
            } w-full`}
          >
            <option disabled value="">
              Model
            </option>
            {gpts.map((gpt, i) => (
              <option key={i} value={gpt}>
                {gpt}
              </option>
            ))}
          </select>
          <p className="text-sm text-error">{state.errors?.model}</p>
        </div>
      </div>
      <FormButton />
      {state.message === "success" && (
        <p className="text-center text-success">Created!</p>
      )}
    </form>
  );
}

const gpts = [
  "gpt-4-turbo",
  "gpt-4-turbo-preview",
  "gpt-3.5-turbo",
  "dall-e-3",
  "dall-e-2",
  "tts-1",
  "davinci-002",
];

export function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-primary">
      {pending ? "Creating..." : "Create"}
    </button>
  );
}
