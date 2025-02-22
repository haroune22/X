import NextAuth, { AuthOptions, Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Missing email or password");
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Incorrect password");
                    }

                    return { id: user.id, email: user.email, name: user.username };
                } catch (error) {
                    console.error("Authorize error:", error);
                    throw new Error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // ✅ Attach `id` from JWT token to session
        async session({ session, token }: { session: Session; token: JWT }) {
            session.user.id = token.id as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);
