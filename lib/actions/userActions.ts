"use server"

import { connectToDb } from "../connection";
import User from "../models/user";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import crypto, { createCipheriv, createDecipheriv, randomBytes } from "crypto";


export const registerUser = async (currentState: { message: string }, formData: FormData) => {
  const { username, email, password } = Object.fromEntries(formData);

  if (!username || !email || !password) {
    return {message: "All fields are required"};
  }

  // Check for duplicate emails
  // Note that you should make emails lowercase when posting them to the DB, to not get duplicate emails registered as not duplicate
  await connectToDb();
  const duplicate = await User.findOne({ email })
    .lean()
    .exec();
  if (duplicate) {
    return {message: "This email is already in use"};
  }

  const stringPassword = String(password)
  const hashedPassword = await bcrypt.hash(stringPassword, 10);
  

  try{
    const user = await User.create({ username, email, password: hashedPassword });
    console.log(user);
  } catch (err) { 
    return {message: "Failed to create user!"};
  }
  
  revalidatePath("/")
  redirect("/")
}

export async function fetchUser(email: string){
  try {
    await connectToDb();
    const user = await User.findOne({ email: email });
    return user.apiKey;
  } catch(err) {
    return "Failed to fetch user!" + err;
  }
}

export async function addApiKey(formData: FormData) {
  const { apiKey, userEmail } = Object.fromEntries(formData);
  if(!apiKey) return { message: "Please provide an API Key" };
  if(!userEmail) return { message: "User not found" };

  const encryptedKey = await encrypt(String(apiKey));
  console.log("KEY",encryptedKey);
  try {
    await connectToDb();
    await User.findOneAndUpdate({ email: userEmail }, { apiKey: encryptedKey})
  } catch(err) {
    return "Error while adding API Key!" + err;
  }

  revalidatePath("/")
  // return { message: "API key successfully added!" }
}

const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

async function encrypt(text: string) {
  if (!key || key.length !== 32) {
    throw new Error('Invalid key length: Key must be 32 bytes for AES-256 encryption.');
  }
  try {
    const iv = randomBytes(16);
    let cipher = createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (err) {
    console.error('Encryption failed:', err);
    throw err;
  }
}

export async function decrypt(text: string) {
  try {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift() as string, 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error('Decryption failed:', err);
    throw err;
  }
}