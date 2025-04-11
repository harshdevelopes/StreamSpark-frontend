import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  /**
   * Extends the built-in Session interface
   */
  interface Session {
    accessToken?: string;
    provider?: string;
  }

  /**
   * Extends the built-in User interface
   */
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT interface
   */
  interface JWT {
    accessToken?: string;
    idToken?: string;
    provider?: string;
  }
}
