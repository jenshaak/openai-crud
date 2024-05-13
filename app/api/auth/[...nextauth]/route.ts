
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/lib/models/user";
import bcrypt from "bcrypt";
import { Account, User as AuthUser, NextAuthOptions, Profile } from "next-auth";
import { connectToDb } from "@/lib/connection";
import NextAuth from "next-auth/next";

const OPTIONS: NextAuthOptions = {
  providers: [
    GitHubProvider({
      profile(profile) {
        console.log("Profile GitHub", profile);

        let userRole = "GitHub User";
        if (profile.email == "jens.haakaas@gmail.com") {
          userRole = "admin";
        }

        return {
          ...profile, // returning the whole profile, with the userRole (either GitHub User or admin)
          id: profile.id.toString(),
          name: profile.login,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      profile(profile) {
        console.log("Profile Google", profile);

        let userRole = "Google User";
        return {
          ...profile,
          id: profile.sub, // Google auth does not provide ID, and we need one. This will provide it
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "text",
          placeholder: "your email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "your password",
        },
      },
      async authorize(credentials) {
        try {
          await connectToDb();
          const foundUser = await User.findOne({ email: credentials?.email });

          if (foundUser) {
            console.log("User Exists");
            const match = await bcrypt.compare(
              credentials!.password,
              foundUser.password
            );
            if (match) {
              console.log("Good Pass");
              delete foundUser.password;
              foundUser["role"] = "Unverified Email";
              return foundUser;
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({user, account}: {user: AuthUser, account: Account | null}){
      console.log("SIGN IN CALLBACK")
      if(account?.provider == "credentials") {
        return true};
      if(account?.provider == "github" || account?.provider == "google"){
        await connectToDb();
        try {
          const existingUser = await User.findOne({email: user.email});
          if(!existingUser){
            User.create({username: user.name, email: user.email});
          }
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          return false;
        }
      }
      return true;
    },
    // Redirecting the "pages {signIn } to the homepage (baseUrl) on succesful login."
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    // adding role to our token, so we can utilize it in our program
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
}; 

export const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST }
    