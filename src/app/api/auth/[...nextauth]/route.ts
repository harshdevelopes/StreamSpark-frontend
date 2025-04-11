import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAuthToken, setAuthToken, apiFetch } from "@/lib/api";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Log environment variables for debugging (remove in production)
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log(
  "Google OAuth setup with CLIENT_ID:",
  process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "..."
);

// Configure NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    // Add Google provider for YouTube authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // Request YouTube scopes
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: "http://localhost:3000/auth/google/loading",
        },
      },
    }),
  ],
  // You can add custom pages here if needed
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
  },
  // Add callbacks to handle token and session
  callbacks: {
    async jwt({ token, account }) {
      console.log("NextAuth JWT callback:", {
        hasToken: !!token,
        hasAccount: !!account,
        accessToken: account?.access_token ? "exists" : "none",
      });
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("NextAuth Session callback:", {
        hasSession: !!session,
        hasToken: !!token,
        accessToken: token.accessToken ? "exists" : "none",
      });
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;

      // Store token in our custom storage if needed
      if (token.accessToken && typeof token.accessToken === "string") {
        setAuthToken(token.accessToken);
        console.log("Auth token stored in local storage");
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("NextAuth SignIn callback:", {
        hasUser: !!user,
        hasAccount: !!account,
        hasProfile: !!profile,
        provider: account?.provider,
        hasIdToken: !!account?.id_token,
      });
      if (account?.provider === "google" && account.id_token) {
        try {
          // Call our backend API with the idToken for Google authentication
          console.log("Calling backend auth API with Google idToken");
          const response = await apiFetch("/auth/google", {
            method: "POST",
            body: JSON.stringify({ idToken: account.id_token }),
          });

          // If backend provides a token, store it
          if (response.token) {
            setAuthToken(response.token);
            console.log("Backend token received and stored");
          } else {
            console.log("No token received from backend");
          }

          return true; // Return true to allow sign in
        } catch (error) {
          console.error("Google authentication error on backend:", error);
          return false; // Return false to deny sign in on API error
        }
      }
      return true; // Default allow sign in
    },
    async redirect({ url, baseUrl }) {
      console.log("NextAuth Redirect callback:", { url, baseUrl });

      // Allow redirects to the loading page
      if (url.startsWith(baseUrl)) {
        console.log("Internal redirect to:", url);
        return url;
      }

      // Default to the loading page for external URLs
      const redirectUrl = `${baseUrl}/auth/google/loading`;
      console.log("External redirect to:", redirectUrl);
      return redirectUrl;
    },
  },
  // Add debug mode to see the actual callback URL
  debug: process.env.NODE_ENV === "development",
};

// Export NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
