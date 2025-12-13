import { loginUser } from "@/app/actions/auth/loginUser";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { dbConnect } from "./dbConnect";
// import dbConnect from "@/database/dbConnect";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text" } // Added role field
            },
            async authorize(credentials) {
                const { email, password, role } = credentials;

                const user = await loginUser({ email, password, role });
                // console.log("Authorize user:", user);

                if (!user) {
                    throw new Error("Invalid email or password");
                }

                // Check role match
                if (role && user.role !== role) {
                    throw new Error("Role mismatch");
                }

                // Return only safe fields
                return user;
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],

    pages: {
        signIn: "/login",
        signUp: "/register", // Add sign up page
    },

    callbacks: {
        async signIn({ user, account }) {
            if (account) {
                const db = await dbConnect();
                const userCollection = db.collection("test_user");

                const isExisted = await userCollection.findOne({
                    providerAccountId: account.providerAccountId,
                });

                if (!isExisted) {
                    await userCollection.insertOne({
                        providerAccountId: account.providerAccountId,
                        provider: account.provider,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                        role: "user",
                        createdAt: new Date(),
                    });
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
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};