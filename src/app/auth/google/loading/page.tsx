"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import { signIn, useSession } from "next-auth/react";

export default function GoogleAuthLoading() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [loadingState, setLoadingState] = useState("initializing");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Auth state:", {
      session,
      status,
      loadingState,
      code: searchParams?.get("code"),
      error: searchParams?.get("error"),
      authToken: getAuthToken(),
    });

    const checkAuthStatus = async () => {
      // Already processing
      if (loadingState !== "initializing") return;

      setLoadingState("processing");

      try {
        // Check for error in the URL parameters
        const errorParam = searchParams?.get("error");
        if (errorParam) {
          setLoadingState("error");
          setError(`Authentication error: ${errorParam}`);
          return;
        }

        // If we already have a session with an access token
        if (status === "authenticated" && session?.accessToken) {
          console.log("We have an authenticated session with access token");
          // Check if we have a token stored from the backend
          const authToken = getAuthToken();

          if (authToken) {
            console.log("Backend token found, redirecting to dashboard");
            // We're authenticated and have a backend token
            setLoadingState("success");
            // Redirect to dashboard after a short delay
            setTimeout(() => router.push("/dashboard"), 500);
            return;
          }

          console.log("No backend token yet, waiting for backend processing");
          // Wait a bit longer for the backend token to be stored
          // This might still be processing in the nextauth callbacks
          setLoadingState("waiting_for_backend");

          // Set a timeout to prevent infinite waiting
          setTimeout(() => {
            const finalToken = getAuthToken();
            if (finalToken) {
              console.log(
                "Backend token eventually found, redirecting to dashboard"
              );
              setLoadingState("success");
              router.push("/dashboard");
            } else {
              console.log("Backend token never arrived, timing out");
              setLoadingState("error");
              setError("Backend authentication timed out");
            }
          }, 10000); // Increased timeout to 10 seconds for backend token

          return;
        }

        // If we're still loading the session, wait
        if (status === "loading") {
          console.log("Session is still loading, waiting...");
          return;
        }

        // If no session, try to initiate sign in (if we have a code from Google)
        const callbackCode = searchParams?.get("code");
        if (!session && callbackCode) {
          console.log(
            "We have a code but no session, completing sign in",
            callbackCode
          );
          // We have a code but no session, try to complete the sign in
          const result = await signIn("google", {
            redirect: false,
            callbackUrl: "/dashboard",
          });

          console.log("Sign in result:", result);

          if (result?.error) {
            setLoadingState("error");
            setError(result.error);
          }
          return;
        }

        // If we get here with no session and no code, redirect to login
        if (!session && !callbackCode) {
          console.log("No session and no code, redirecting to login");
          setLoadingState("not_authenticated");
          setTimeout(() => router.push("/login"), 1000);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setLoadingState("error");
        setError(
          err instanceof Error ? err.message : "Unknown authentication error"
        );
      }
    };

    checkAuthStatus();

    // Poll for token changes every second
    const intervalId = setInterval(() => {
      if (loadingState === "waiting_for_backend") {
        console.log("Polling for backend token...");
        const token = getAuthToken();
        if (token) {
          console.log(
            "Backend token found while polling, redirecting to dashboard"
          );
          setLoadingState("success");
          clearInterval(intervalId);
          router.push("/dashboard");
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [router, session, status, loadingState, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 text-center">
        <div className="inline-block mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto">
            S
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {loadingState === "error"
            ? "Authentication Error"
            : loadingState === "success"
            ? "Authentication Successful"
            : loadingState === "not_authenticated"
            ? "Not Authenticated"
            : "Authenticating with YouTube"}
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {loadingState === "error"
            ? "There was a problem authenticating your account"
            : loadingState === "success"
            ? "Redirecting you to your dashboard..."
            : loadingState === "not_authenticated"
            ? "Redirecting to login page..."
            : loadingState === "waiting_for_backend"
            ? "Waiting for backend authentication..."
            : "Please wait while we securely sign you in"}
        </p>

        {loadingState !== "error" &&
          loadingState !== "success" &&
          loadingState !== "not_authenticated" && (
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-10 w-10 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}

        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              Please ensure you've configured the correct redirect URI in Google
              Console.
            </p>
          </div>
        )}

        {loadingState === "error" && (
          <button
            onClick={() => router.push("/login")}
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}
