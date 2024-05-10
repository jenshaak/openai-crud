"use server"

import { createDecipheriv } from "crypto";
import OpenAI from "openai";
import { decrypt } from "./actions/userActions";
import { revalidatePath } from "next/cache";
import { ZodError, z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Fields = {
  apiKey: string,
  name: string,
  instructions: string,
  model: string,
  id?: string | undefined,
}

const schema = z.object({
  apiKey: z.string().min(2),
  name: z.string().min(2).max(32),
  instructions: z.string().min(5),
  model: z.string().min(2),
});

type FormState = {
  message: string,
  errors: Record<keyof Fields, string> | undefined,
  fieldValues: Fields;
}

// Create assistant
export async function createOrUpdateAssistant(prevState: FormState, formdata: FormData){
  const formdataObj = Object.fromEntries(formdata);
  const { id, apiKey, name, instructions, model } = formdataObj as Fields;
  try {
    schema.parse({ apiKey, name, instructions, model });
    console.log("FUNCTION")
    const decryptedKey = await decrypt(apiKey);
    const usersOpenai = new OpenAI({ apiKey: decryptedKey });
    if(id) {
      console.log("UPDATE")
      await usersOpenai.beta.assistants.update(id, {
        name: name,
        instructions: instructions,
        tools: [],
        model: model,
      });
    } else {
      console.log("CREATE")
      await usersOpenai.beta.assistants.create({
        name: name,
        instructions: instructions,
        tools: [],
        model: model,
      });
    }
    revalidatePath("/");
    return {
      message: "success",
      errors: undefined,
      fieldValues: {
        apiKey: "",
        name: "",
        instructions: "",
        model: "",
      }
    } 
  } catch(err) {
    const zodError = err as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      message: "error",
      errors: {
        apiKey: errorMap["apiKey"]?.[0] ?? "",
        name: errorMap["name"]?.[0] ?? "",
        instructions: errorMap["instructions"]?.[0] ?? "",
        model: errorMap["model"]?.[0] ?? "",
        id: errorMap["id"]?.[0] ?? "",
      },
      fieldValues: { apiKey, name, instructions, model, id }
    };
  }
}

// // Update assistant
// export async function updateAssistant(formdata: FormData){
//   const formdataObj = Object.fromEntries(formdata);
//   const { id, apiKey, name, instructions, model } = formdataObj as Fields;
//   const decryptedKey = await decrypt(apiKey);
//   const usersOpenai = new OpenAI({ apiKey: decryptedKey });
//   const assistant = await usersOpenai.beta.assistants.update(id, {
//     name: name,
//     instructions: instructions,
//     tools: [],
//     model: model,
//   });
//   console.log(assistant.name);
//   revalidatePath("/");
//   return assistant.name;
// }

export async function deleteAssistant(formData: FormData) {
  const { id, apiKey } = Object.fromEntries(formData) as Fields;
  if(id) {
    const decryptedKey = await decrypt(apiKey);
    const usersOpenai = new OpenAI({ apiKey: decryptedKey });
    await usersOpenai.beta.assistants.del(id);
    revalidatePath("/");
  } else {
    return false;
  }
};

// List assistant
export async function listAssistants(apiKey?: string) {
  let assistants;
  if(apiKey) {
    const decryptedKey = await decrypt(apiKey);
    const usersOpenai = new OpenAI({ apiKey: decryptedKey });
    assistants = await usersOpenai.beta.assistants.list();
  } else {
    assistants = await openai.beta.assistants.list();
  }
  return assistants.data;
};

// Retrieve assistant
export async function retrieveAssistant(id: string, apiKey?: string) {
  let assistant;
  if(apiKey) {
    const decryptedKey = await decrypt(apiKey);
    console.log(decryptedKey);
    const usersOpenai = new OpenAI({ apiKey: decryptedKey });
    assistant = await usersOpenai.beta.assistants.retrieve(id);
  } else {
    assistant = await openai.beta.assistants.retrieve(id);
  }
  return assistant;
};
