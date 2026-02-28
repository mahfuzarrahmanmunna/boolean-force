// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/mongodbAdapter";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Please enter your email and password");
                }

                try {
                    const client = await clientPromise;
                    const db = client.db(process.env.DB_NAME);
                    const users = db.collection("users");

                    const user = await users.findOne({ email: credentials.email });

                    if (!user || !user.password) {
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
                        role: user.role || "worker", // Default to worker if no role specified
                    };
                } catch (error) {
                    const msg = error?.message ?? "";
                    const isDbUnavailable =
                        msg.includes("ECONNREFUSED") ||
                        msg.includes("querySrv") ||
                        msg.includes("ENOTFOUND");
                    if (isDbUnavailable) {
                        if (process.env.NODE_ENV === "development") {
                            console.error("Auth error (DB unreachable):", msg);
                        }
                        throw new Error(
                            "Database is unavailable. Check your internet connection and try again."
                        );
                    }
                    console.error("Auth error:", error);
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
        async signIn({ user, account }) {
            if (account.provider === "google" || account.provider === "github") {
                try {
                    const client = await clientPromise;
                    const db = client.db(process.env.DB_NAME);
                    const users = db.collection("users");

                    const existingUser = await users.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create a new user with default "worker" role
                        await users.insertOne({
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            role: "worker", // Default role for social signups
                            createdAt: new Date(),
                        });

                        // Set role on user object
                        user.role = "worker";
                    } else {
                        // Set role from existing user
                        user.role = existingUser.role || "worker";
                    }
                } catch (error) {
                    const msg = error?.message ?? "";
                    if (!msg.includes("ECONNREFUSED") && !msg.includes("querySrv")) {
                        console.error("Error during social sign in:", error);
                    }
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };