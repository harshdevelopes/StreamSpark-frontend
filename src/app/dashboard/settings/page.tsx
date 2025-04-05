import React from "react";

export default function SettingsPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Settings
      </h2>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <p className="text-slate-600 dark:text-slate-300">
          Account settings, payment settings, notification preferences, etc.,
          will go here.
        </p>
        {/* Add settings sections/forms */}
      </div>
    </div>
  );
}
