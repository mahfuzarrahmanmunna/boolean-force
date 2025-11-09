// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodbAdapter"; // We'll fix this in part 2

// 1. Create and export the configuration object
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // This part is okay for now
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password");
                }

                try {
                    const client = await clientPromise;
                    const db = client.db(process.env.DB_NAME); // Make sure to use the DB name
                    const users = db.collection("users");

                    const user = await users.findOne({ email: credentials.email });

                    if (!user || !user.password) { // Check if user or password exists
                        throw new Error("No user found with this email");
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image || null,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    // It's better to throw a generic error to the user
                    throw new Error("Invalid credentials");
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        signUp: "/register",
        error: "/auth/error",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) { // Add a check for session.user
                session.user.id = token.id; // Use 'as string' for TypeScript
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

// 2. Pass the configuration object to NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };