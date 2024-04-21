import Chat from "@/components/Chat";
import { retrieveAssistant } from "@/lib/openai";
import React from "react";

type Props = {
  params: {
    id: string;
  };
};

export default async function ChatAssistantPage({ params: { id } }: Props) {
  const assistant = await retrieveAssistant(id);
  return (
    <div className="h-full">
      <h2 className="text-center text-2xl font-semibold">{assistant.name}</h2>
      <Chat assistantId={id} />
    </div>
  );
}
