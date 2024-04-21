"use server"

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Props = {
  name: string,
  instructions: string,
  model: string,
}

// Create assistant
export async function createAssistant(formdata: FormData){
  const formdataObj = Object.fromEntries(formdata);
  const { name, instructions, model } = formdataObj as Props;
  const assistant = await openai.beta.assistants.create({
    name: name,
    instructions: instructions,
    tools: [],
    model: model,
  });
  console.log(assistant.name);
  return assistant.name;
}

// List assistant
export async function listAssistants() {
  const assistants = await openai.beta.assistants.list();
  console.log(assistants.data[0].name);
  return assistants.data;
};

// Retrieve assistant
export async function retrieveAssistant(id: string) {
  const assistant = await openai.beta.assistants.retrieve(id);
  return assistant;
};
