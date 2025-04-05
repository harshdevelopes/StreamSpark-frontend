"use client"; // Assuming dashboard interactions

import React, { useState, useEffect } from "react";
import { FaDollarSign, FaUsers } from "react-icons/fa";
import Link from "next/link"; // Import Link
import { useDashboardStats, useRecentTips } from "@/lib/api"; // Import hooks

// Need SUPPORTED_CURRENCIES definition (copy from tipping page or define here)
const SUPPORTED_CURRENCIES = {
  INR: { symbol: "₹", factor: 100 },
  USD: { symbol: "$", factor: 100 },
  EUR: { symbol: "€", factor: 100 },
  GBP: { symbol: "£", factor: 100 },
};
type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

const API_BASE_URL = "http://localhost:8000/api"; // Add Base URL

export default function DashboardPage() {
  // Removed manual state management
  // const [stats, setStats] = useState<any>(null);
  // const [recentTips, setRecentTips] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // --- Use React Query Hooks ---
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useDashboardStats();
  const {
    data: tipsData,
    isLoading: isLoadingTips,
    error: tipsError,
  } = useRecentTips(5); // Fetch 5 recent tips

  // Combine loading and error states
  const isLoading = isLoadingStats || isLoadingTips;
  const error = statsError || tipsError;

  // Extract data (handle potential undefined state during initial load)
  const stats = statsData;
  const recentTips = tipsData?.tips || []; // Default to empty array if tipsData or tipsData.tips is undefined

  // --- Render Logic ---
  if (isLoading) {
    return <div className="text-center p-10">Loading Dashboard...</div>;
  }

  if (error) {
    // Use error.message from the hook's error object
    return (
      <div className="text-center p-10 text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    // The main div and sidebar structure are removed.
    // The content starts directly, as it will be wrapped by layout.tsx
    <>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
          Dashboard Overview
        </h2>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <FaDollarSign className="text-green-500" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Total Tips Received
            </h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {/* Use fetched data - fallback to 0 if null */}₹
            {(stats?.totalTips || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <FaDollarSign className="text-blue-500" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Tips Today
            </h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            ₹{(stats?.tipsToday || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <FaUsers className="text-purple-500" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Unique Supporters
            </h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {stats?.uniqueSupporters || 0}
          </p>
        </div>
      </div>

      {/* Recent Tips Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
          Recent Tips
        </h3>
        <div className="overflow-x-auto">
          {recentTips.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Amount</th>
                  <th className="py-2 px-4 hidden md:table-cell">Message</th>
                </tr>
              </thead>
              <tbody>
                {recentTips.map((tip) => (
                  <tr
                    key={tip.id}
                    className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                      {tip.name}
                    </td>
                    <td className="py-3 px-4 font-medium text-indigo-600 dark:text-indigo-400">
                      {SUPPORTED_CURRENCIES[tip.currency as CurrencyCode]
                        ?.symbol || tip.currency}
                      {tip.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 hidden md:table-cell italic">
                      {tip.message || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-slate-500 dark:text-slate-400 py-4">
              No recent tips found.
            </p>
          )}
        </div>
        <div className="mt-4 text-right">
          <Link
            href="/dashboard/tips"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View All Tips
          </Link>
        </div>
      </div>
    </>
  );
}
