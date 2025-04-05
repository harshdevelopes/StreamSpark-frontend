"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter
import {
  FaChartBar,
  FaHistory,
  FaLink,
  FaCog,
  FaSignOutAlt,
  FaBullhorn,
} from "react-icons/fa";
import { removeAuthToken, getAuthToken } from "@/lib/api"; // Import the removeAuthToken function and getAuthToken
import { useQueryClient } from "@tanstack/react-query";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get current path
  const router = useRouter(); // Initialize router
  const queryClient = useQueryClient();

  const isActive = (path: string) => pathname === path;

  // Check for authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    // Remove the auth token
    removeAuthToken();

    // Invalidate all queries in the cache
    queryClient.clear();

    // Redirect to login page
    router.push("/login");
  };

  return (
    // Using the same consistent theme background
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <div className="flex h-screen">
        {/* Sidebar Navigation - Moved from page.tsx */}
        <aside className="w-64 bg-white dark:bg-slate-800 p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="mb-10 flex items-center gap-3">
              {/* Logo/Brand */}
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                SuperTip
              </h1>
            </div>
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <FaChartBar />
                <span>Overview</span>
              </Link>
              <Link
                href="/dashboard/tips"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard/tips")
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <FaHistory />
                <span>Tip History</span>
              </Link>
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard/profile")
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <FaLink />
                <span>My Page</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard/settings")
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <FaCog />
                <span>Settings</span>
              </Link>
              <Link
                href="/dashboard/widgets"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard/widgets")
                    ? "text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 font-medium"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <FaBullhorn />
                <span>Stream Widgets</span>
              </Link>
            </nav>
          </div>
          <div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area - Render the specific page here */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children} {/* Render the active page content */}
        </main>
      </div>
    </div>
  );
}
