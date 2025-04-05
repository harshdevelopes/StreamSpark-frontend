import React from "react";
import Link from "next/link";

export default function MyPageProfilePage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        My Public Page
      </h2>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Manage your public SuperTip page settings and appearance here.
        </p>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Your public page URL:
          <Link
            href="/streamer/your-username"
            target="_blank"
            className="ml-2 text-indigo-600 hover:underline dark:text-indigo-400"
          >
            /streamer/your-username
          </Link>
          (Replace 'your-username' dynamically)
        </p>
        {/* Add profile editing form/components */}
      </div>
    </div>
  );
}
