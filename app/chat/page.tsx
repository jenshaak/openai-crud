import PickAssistant from "@/components/PickAssistant";
import { listAssistants } from "@/lib/openai";
import React from "react";

export default async function CreatePage() {
  const assistants = await listAssistants();
  return (
    <div>
      <PickAssistant assistants={assistants} />
    </div>
  );
}
