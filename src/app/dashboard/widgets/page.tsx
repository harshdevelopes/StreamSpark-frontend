"use client"; // May need client-side interaction later (e.g., copying URL)

import React, { useState, useMemo, useEffect } from "react";

// Define themes (can share definition with alert page if needed)
const themes = [
  { id: "default", name: "Default" },
  { id: "cyberpunk", name: "Cyberpunk" },
  { id: "fantasy", name: "Fantasy" },
  { id: "space", name: "Space" },
  { id: "cozy", name: "Cozy" },
  { id: "pixel", name: "Pixel Art" },
  { id: "anime", name: "Anime" },
  { id: "horror", name: "Horror" },
  { id: "scifi", name: "Sci-Fi HUD" },
  { id: "nature", name: "Nature" },
];
type ThemeId = (typeof themes)[number]["id"];

// Define Sound Options (Replace with actual URLs)
const soundOptions = [
  {
    id: "default_sound",
    name: "Default Beep",
    url: "/sounds/default-beep.mp3",
  },
  { id: "coin_drop", name: "Coin Drop", url: "/sounds/coin-drop.wav" },
  { id: "magic_chime", name: "Magic Chime", url: "/sounds/magic-chime.ogg" },
  { id: "sci_fi_blip", name: "Sci-Fi Blip", url: "/sounds/sci-fi-blip.mp3" },
  { id: "none", name: "No Sound", url: "" },
];
type SoundId = (typeof soundOptions)[number]["id"];

export default function WidgetsPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeId>("default");
  const [copied, setCopied] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundId>("default_sound");

  // Generate URLs based on selected theme AND sound
  const baseUrl = `http://localhost:3000/alerts/tip`;
  const alertUrl = useMemo(() => {
    const selectedSoundUrl =
      soundOptions.find((s) => s.id === selectedSound)?.url || "";
    const encodedSoundUrl = encodeURIComponent(selectedSoundUrl);
    return `${baseUrl}?theme=${selectedTheme}&sound=${encodedSoundUrl}`;
    // In real app: `${baseUrl}?token=USER_TOKEN&theme=${selectedTheme}&sound=${encodedSoundUrl}`
  }, [selectedTheme, selectedSound]);

  const testUrl = useMemo(() => {
    return `${alertUrl}&name=TestTip&amount=5&currency=USD&message=Testing%20sound%20alert!`;
  }, [alertUrl]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(alertUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
        Stream Widgets - Tip Alert
      </h2>

      {/* Theme Selector */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          Select Alert Theme
        </h3>
        <div className="flex flex-wrap gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedTheme === theme.id
                  ? "bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2 ring-offset-white dark:ring-offset-slate-800"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Selector */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          Select Alert Sound
        </h3>
        <select
          value={selectedSound}
          onChange={(e) => setSelectedSound(e.target.value as SoundId)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-100"
        >
          {soundOptions.map((sound) => (
            <option key={sound.id} value={sound.id}>
              {sound.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Plays a sound when the tip alert appears. Ensure you have placed the
          sound files in the public/sounds directory.
        </p>
      </div>

      {/* URL Display and Copy */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          Your Tip Alert URL
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Add this URL as a Browser Source in OBS, Streamlabs, or other
          streaming software to display alerts when you receive a tip.
        </p>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-3 rounded-md">
          <input
            type="text"
            readOnly
            value={alertUrl}
            className="flex-grow bg-transparent text-slate-700 dark:text-slate-200 text-sm focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className={`text-sm px-3 py-1 rounded ${
              copied
                ? "bg-green-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            } transition-colors whitespace-nowrap`}
          >
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          This URL is unique to your account. Keep it private.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">
          How to Use in OBS/Streamlabs
        </h3>
        <ol className="list-decimal list-inside space-y-3 text-slate-600 dark:text-slate-300">
          <li>
            <strong>Add a Source:</strong> In your streaming software, click the
            '+' button to add a new source.
          </li>
          <li>
            <strong>Select Browser Source:</strong> Choose "Browser" or "Browser
            Source" from the list.
          </li>
          <li>
            <strong>Enter URL:</strong> Paste the unique Tip Alert URL (copied
            above) into the URL field.
          </li>
          <li>
            <strong>Set Dimensions:</strong> Adjust the width and height.
            Recommended starting point: Width: 600, Height: 300 (adjust as
            needed for your overlay).
          </li>
          <li>
            <strong>Transparent Background:</strong> Ensure the background is
            transparent. Often, no extra settings are needed if the page itself
            has a transparent background.
          </li>
          <li>
            <strong>Refresh on Activate (Optional but Recommended):</strong> In
            the source properties, consider checking options like "Refresh
            browser when scene becomes active" to ensure it loads fresh.
          </li>
          <li>
            <strong>Test Alert:</strong> You can test the alert by visiting this
            URL in a separate browser tab (replace parameters as needed):
            <a
              href={testUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-indigo-600 hover:underline dark:text-indigo-400 break-all"
            >
              {testUrl}
            </a>
          </li>
          <li>
            <strong>Position and Style:</strong> Place the browser source where
            you want it in your scene. The alert animation and styling are
            handled by the web page.
          </li>
        </ol>
      </div>
    </div>
  );
}
