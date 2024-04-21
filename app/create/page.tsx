import { createAssistant } from "@/lib/openai";
import React from "react";

export default function CreatePage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>Create an assistant</h1>
      <form action={createAssistant} className="flex flex-col gap-3 w-max">
        <input
          type="text"
          className="input input-primary"
          name="name"
          placeholder="name..."
        />
        <textarea
          className="textarea textarea-primary"
          name="instructions"
          placeholder="instructions..."
        />
        <select name="model" className="select select-primary w-full max-w-xs">
          <option disabled selected>
            Model
          </option>
          {gpts.map((gpt, i) => (
            <option key={i} value={gpt}>
              {gpt}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
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
