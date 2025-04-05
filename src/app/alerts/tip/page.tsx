"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
// Import our custom hook
import useSocket from "@/lib/hooks/useSocket";
import {
  FaStar, // Anime
  FaHeart, // Cozy
  FaSkullCrossbones, // Horror
  FaLeaf, // Nature
  FaRocket, // Space & SciFi
  FaGamepad, // Pixel
  FaBroadcastTower, // Cyberpunk
  FaChessKnight, // Fantasy
  FaInfoCircle, // Default
} from "react-icons/fa"; // Import relevant icons

// Helper to get currency symbol and approximate USD value
const SUPPORTED_CURRENCIES = {
  INR: { symbol: "₹", usdRate: 0.012 },
  USD: { symbol: "$", usdRate: 1 },
  EUR: { symbol: "€", usdRate: 1.1 },
  GBP: { symbol: "£", usdRate: 1.25 },
};
type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

// --- Theme Definitions ---
// Each theme defines classes, animation variants, and potentially an icon
const themes = {
  default: {
    name: "Default",
    icon: FaInfoCircle,
    containerClasses:
      "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border border-white/30 rounded-lg",
    headerClasses: "bg-black/20 px-4 py-2",
    bodyClasses: "px-4 py-3",
    nameClasses: "font-bold text-lg",
    amountClasses: "font-semibold text-lg",
    messageClasses: "text-sm italic mt-1",
    animation: {
      initial: { opacity: 0, y: 50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 50 },
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  },
  cyberpunk: {
    name: "Cyberpunk",
    icon: FaBroadcastTower,
    containerClasses:
      "bg-black text-cyan-300 border-2 border-fuchsia-500 font-mono shadow-[0_0_15px_rgba(217,70,239,0.8)] backdrop-blur-sm rounded-sm",
    headerClasses: "bg-fuchsia-900/50 px-4 py-1 border-b border-fuchsia-500",
    bodyClasses: "px-4 py-3",
    nameClasses: "font-bold text-lg text-fuchsia-400 tracking-widest",
    amountClasses: "font-semibold text-lg text-lime-300",
    messageClasses: "text-sm text-cyan-300 mt-1 glitch-text", // Needs specific CSS for glitch
    animation: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
      transition: { type: "spring", stiffness: 150, damping: 10 },
    },
  },
  fantasy: {
    name: "Fantasy",
    icon: FaChessKnight,
    containerClasses:
      "bg-gradient-to-br from-yellow-800 via-amber-800 to-yellow-900 text-yellow-100 border-2 border-amber-500 rounded-lg font-serif shadow-lg",
    headerClasses: "bg-black/30 px-4 py-2 rounded-t-lg",
    bodyClasses: "px-4 py-3",
    nameClasses: "font-bold text-lg text-amber-300",
    amountClasses: "font-semibold text-lg text-white",
    messageClasses: "text-sm italic text-yellow-200 mt-1",
    animation: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -90 },
      transition: { duration: 0.5 },
    },
  },
  space: {
    name: "Space",
    icon: FaRocket,
    containerClasses:
      "bg-gray-900 text-gray-100 border border-blue-400 rounded-sm font-sans shadow-[0_0_10px_rgba(96,165,250,0.6)]",
    headerClasses: "bg-blue-900/50 px-4 py-2 flex justify-between items-center",
    bodyClasses: "px-4 py-3 border-t border-blue-400/50",
    nameClasses: "font-semibold text-base text-blue-300 uppercase",
    amountClasses: "font-bold text-lg text-white",
    messageClasses: "text-xs text-gray-300 mt-1",
    animation: {
      initial: { opacity: 0, y: -50 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -50 },
      transition: { type: "tween", ease: "anticipate", duration: 0.6 },
    },
  },
  cozy: {
    name: "Cozy",
    icon: FaHeart,
    containerClasses:
      "bg-pink-100 text-pink-800 border border-pink-300 rounded-2xl shadow-md font-sans",
    headerClasses:
      "bg-pink-200/70 px-4 py-2 rounded-t-2xl flex items-center gap-2",
    bodyClasses: "px-4 py-3",
    nameClasses: "font-semibold text-base text-pink-700",
    amountClasses: "font-bold text-base text-pink-600",
    messageClasses: "text-sm text-pink-700/90 mt-1",
    animation: {
      initial: { opacity: 0, scale: 0.8, rotate: -10 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      exit: { opacity: 0, scale: 0.8, rotate: 10 },
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  },
  // --- NEW THEMES ---
  pixel: {
    name: "Pixel Art",
    icon: FaGamepad,
    containerClasses:
      "bg-gray-700 text-white border-4 border-gray-500 font-pixelated pixelated-corners rounded-none", // Needs specific CSS
    headerClasses: "bg-gray-800 px-3 py-1 border-b-4 border-gray-500",
    bodyClasses: "px-3 py-2",
    nameClasses: "font-bold text-sm uppercase",
    amountClasses: "font-bold text-sm text-yellow-300",
    messageClasses: "text-xs mt-1",
    animation: {
      // Instant appearance, slight bounce?
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { delay: 0.1 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  },
  anime: {
    name: "Anime / Kawaii",
    icon: FaStar,
    containerClasses:
      "bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 text-gray-800 border border-white/50 rounded-xl shadow-lg",
    headerClasses:
      "bg-white/70 px-4 py-2 rounded-t-xl flex justify-between items-center",
    bodyClasses: "px-4 py-3",
    nameClasses: "font-bold text-lg text-purple-700",
    amountClasses: "font-bold text-lg text-pink-600",
    messageClasses: "text-sm text-gray-700 mt-1",
    animation: {
      // Pop and sparkle?
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.5 },
      transition: { type: "spring", stiffness: 180, damping: 12 },
    },
  },
  horror: {
    name: "Horror / Grunge",
    icon: FaSkullCrossbones,
    containerClasses:
      "bg-black/80 text-red-500 border border-red-900 font-mono distorted-border rounded-none", // Needs specific CSS
    headerClasses: "bg-black/50 px-3 py-1 border-b border-red-900",
    bodyClasses: "px-3 py-2",
    nameClasses: "font-normal text-base text-gray-300",
    amountClasses: "font-bold text-lg text-red-500",
    messageClasses: "text-xs text-gray-400 mt-1",
    animation: {
      // Flicker in/out?
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 1, 0.8, 1, 0.9, 1],
        transition: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      },
      exit: { opacity: 0, transition: { duration: 0.3 } },
      transition: {},
    },
  },
  scifi: {
    name: "Sci-Fi HUD",
    icon: FaRocket, // Reusing space icon for now
    containerClasses:
      "bg-blue-900/70 backdrop-blur-sm text-cyan-300 border border-cyan-500 hud-lines rounded-none", // Needs specific CSS
    headerClasses: "bg-black/30 px-4 py-1 flex justify-between items-center",
    bodyClasses: "px-4 py-2 border-t border-cyan-500/50",
    nameClasses: "font-medium text-sm uppercase tracking-wider",
    amountClasses: "font-bold text-base text-white",
    messageClasses: "text-xs text-cyan-200/80 mt-1 font-mono",
    animation: {
      initial: { opacity: 0, clipPath: "inset(0 100% 0 0)" }, // Wipe in
      animate: { opacity: 1, clipPath: "inset(0 0 0 0)" },
      exit: { opacity: 0, clipPath: "inset(0 0 0 100%)" }, // Wipe out
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  },
  nature: {
    name: "Nature / Serene",
    icon: FaLeaf,
    containerClasses:
      "bg-green-800/80 backdrop-blur-sm text-green-100 border border-green-600 rounded-lg shadow-md",
    headerClasses: "bg-green-900/50 px-4 py-2 rounded-t-lg",
    bodyClasses: "px-4 py-3",
    nameClasses: "font-semibold text-base text-white",
    amountClasses: "font-bold text-lg text-lime-300",
    messageClasses: "text-sm text-green-200/90 mt-1",
    animation: {
      // Gentle fade and slight scale
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
};
type ThemeName = keyof typeof themes;

// --- Amount determines duration ---
const getDuration = (amountUSD: number) => {
  if (amountUSD >= 100) return 15000;
  if (amountUSD >= 50) return 12000;
  if (amountUSD >= 10) return 10000;
  if (amountUSD >= 5) return 8000;
  return 7000;
};

// Type for test tip event
interface TestTip {
  name: string;
  amount: string;
  currency: CurrencyCode;
  message?: string;
  soundUrl?: string;
  theme?: ThemeName;
}

export default function TipAlertPage() {
  console.log("===== TipAlertPage Component Rendered =====");

  const searchParams = useSearchParams();
  const [alertData, setAlertData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<typeof themes.default>(
    themes.default
  );
  const [duration, setDuration] = useState(7000);
  const [themeName, setThemeName] = useState<ThemeName>("default");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const testTipHandlerRef = useRef<(data: TestTip) => void>(() => {});

  // Log initial token for debugging
  const alertToken = searchParams.get("token");
  useEffect(() => {
    if (alertToken) {
      console.log(
        `🔑 TipAlert: Using alert token: ${alertToken.substring(0, 6)}...`
      );
    } else {
      console.warn("⚠️ TipAlert: No alert token provided in URL params!");
    }
  }, [alertToken]);

  // Process incoming tip function (defined early for the socket hook)
  const processNewTip = useCallback((tipData: any) => {
    console.log("🔔 TipAlert: NEW TIP EVENT RECEIVED!", tipData);
    console.table({
      name: tipData.name,
      amount: tipData.amount,
      currency: tipData.currency,
      message:
        tipData.message?.substring(0, 30) +
          (tipData.message?.length > 30 ? "..." : "") || "No message",
    });

    // If a theme is specified in the tip data, use it
    if (tipData.theme && themes[tipData.theme as ThemeName]) {
      console.log(
        `🎨 TipAlert: Setting theme from tip data to "${tipData.theme}"`
      );
      const selectedTheme = themes[tipData.theme as ThemeName];
      setCurrentTheme(selectedTheme as typeof themes.default);
      setThemeName(tipData.theme as ThemeName);
    }

    // Clear previous alert immediately if new one comes in
    setIsVisible(false);
    setAlertData(null);

    // Short delay to allow exit animation before showing new alert
    const displayTimeout = setTimeout(() => {
      const { name, amount, currency, message, soundUrl } = tipData;

      if (
        name &&
        amount &&
        currency &&
        SUPPORTED_CURRENCIES[currency as CurrencyCode]
      ) {
        console.log(
          `🎬 TipAlert: Processing tip - ${name} (${currency}${amount})`
        );

        const currencyInfo = SUPPORTED_CURRENCIES[currency as CurrencyCode];
        const amountNum = parseFloat(amount);
        const amountUSD = amountNum * currencyInfo.usdRate;
        const alertDuration = getDuration(amountUSD);
        setDuration(alertDuration);

        const displayAmount = `${
          currencyInfo.symbol
        }${amountNum.toLocaleString()}`;

        // Set alert data from tip event
        setAlertData({
          name,
          amount: displayAmount,
          message,
        });
        console.log(
          `🌟 TipAlert: Alert data set, showing for ${alertDuration}ms`
        );
        setIsVisible(true);

        // Play sound if provided
        if (soundUrl && audioRef.current) {
          console.log(`🔊 TipAlert: Playing sound: ${soundUrl}`);
          audioRef.current.src = decodeURIComponent(soundUrl);
          audioRef.current
            .play()
            .catch((error) => console.error("❌ Audio play failed:", error));
        }

        const timer = setTimeout(() => {
          console.log(`⏱️ TipAlert: Alert duration complete, hiding animation`);
          setIsVisible(false);
        }, alertDuration);

        const resetTimer = setTimeout(() => {
          console.log(`🧹 TipAlert: Cleanup complete, alert data cleared`);
          setAlertData(null);
        }, alertDuration + 1000); // Give exit animation more time

        // Store timers to clear them in cleanup
        window.tipAlertTimers = { timer, resetTimer, displayTimeout };
      } else {
        console.error("❌ TipAlert: Invalid tip data format:", tipData);
      }
    }, 500);

    return () => {
      console.log(`🧹 TipAlert: Cleaning up timers and alert data`);
      clearTimeout(displayTimeout);
      if (window.tipAlertTimers) {
        clearTimeout(window.tipAlertTimers.timer);
        clearTimeout(window.tipAlertTimers.resetTimer);
      }
    };
  }, []);

  // Store the latest processNewTip in a ref for the test function
  testTipHandlerRef.current = processNewTip;

  // Add test function to window object for easier testing
  useEffect(() => {
    // Add a test function to window object
    window.testTip = (tipData: Partial<TestTip> = {}) => {
      console.log("🧪 TipAlert: Test tip triggered from console!");

      // Default test data with any overrides
      const testData: TestTip = {
        name: tipData.name || "Test Donor",
        amount: tipData.amount || "50",
        currency: tipData.currency || "USD",
        message: tipData.message || "This is a test tip from the console!",
        soundUrl: tipData.soundUrl || "/sounds/default-beep.mp3",
        theme: tipData.theme,
      };

      console.log("🧪 TipAlert: Sending test data:", testData);
      testTipHandlerRef.current(testData);

      return "Test tip triggered! Check the alert.";
    };

    // Add a help function
    window.tipHelp = () => {
      console.log(`
📋 TipAlert Console Commands:
----------------------------
window.testTip()                   - Trigger default test tip
window.testTip({                   - Trigger custom test tip
  name: "John Doe", 
  amount: "100", 
  currency: "USD",
  message: "Great stream!",
  theme: "cyberpunk"               - Try different themes: ${Object.keys(
    themes
  ).join(", ")}
})
window.tipHelp()                   - Show this help

Theme options: ${Object.keys(themes).join(", ")}
Currency options: ${Object.keys(SUPPORTED_CURRENCIES).join(", ")}
      `);
      return "Tip testing help shown in console";
    };

    console.log(
      "🧪 TipAlert: Test functions added to window object. Try window.testTip() or window.tipHelp()"
    );

    // Cleanup on unmount
    return () => {
      delete window.testTip;
      delete window.tipHelp;
    };
  }, []);

  // Use our custom socket hook with the new_tip event handler
  const {
    status: connectionStatus,
    isConnected,
    setComponentName,
    sendEvent,
  } = useSocket(
    {
      new_tip: processNewTip,
    },
    alertToken || undefined
  );

  // Log socket connection status changes
  useEffect(() => {
    console.log(
      `🔌 TipAlert: Socket connection status changed to "${connectionStatus}"`
    );
    if (connectionStatus === "connected") {
      console.log(
        "✅ TipAlert: Socket connected and listening for tip events!"
      );
    } else if (connectionStatus === "error") {
      console.error(
        "❌ TipAlert: Socket connection error! Check token and server status."
      );
    } else if (connectionStatus === "disconnected") {
      console.warn(
        "⚠️ TipAlert: Socket disconnected. Will try to reconnect automatically."
      );
    }
  }, [connectionStatus]);

  // Set component name for better logging
  useEffect(() => {
    console.log("📝 TipAlert: Setting component name for logs");
    setComponentName("TipAlertPage");
  }, [setComponentName]);

  // Handle theme from URL
  useEffect(() => {
    const currentThemeName =
      (searchParams.get("theme") as ThemeName) || "default";

    console.log(`🎨 TipAlert: Setting theme to "${currentThemeName}"`);

    const selectedTheme = themes[currentThemeName] || themes.default;
    setCurrentTheme(selectedTheme as typeof themes.default);
    setThemeName(currentThemeName);
  }, [searchParams]);

  // --- URL-based Alert Logic (fallback) ---
  useEffect(() => {
    // Only process URL params if we're not connected via socket
    if (isConnected) {
      console.log("🔄 TipAlert: Socket connected, skipping URL-based alerts");
      return;
    }

    const name = searchParams.get("name");
    const amountStr = searchParams.get("amount");
    const currency = searchParams.get("currency") as CurrencyCode;
    const message = searchParams.get("message");
    const soundUrl = searchParams.get("sound");

    if (name && amountStr && currency && SUPPORTED_CURRENCIES[currency]) {
      console.log(
        `📨 TipAlert: URL params detected, processing as fallback tip:`,
        {
          name,
          amount: amountStr,
          currency,
          message: message?.substring(0, 20) + "...",
        }
      );

      // Process as tip data
      processNewTip({
        name,
        amount: amountStr,
        currency,
        message,
        soundUrl,
      });
    }
  }, [searchParams, isConnected, processNewTip]);

  const IconComponent = currentTheme.icon; // Get the icon component

  // Check for headerOnly property with optional chaining to fix the TypeScript error
  const showMinimalBody =
    !alertData?.message && !(currentTheme as any).headerOnly;

  // Log render state
  useEffect(() => {
    if (isVisible && alertData) {
      console.log(
        `🎬 TipAlert: Alert is now visible with theme "${themeName}"`
      );
    }
  }, [isVisible, alertData, themeName]);

  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex items-start justify-center p-4"
      style={{ background: "transparent" }}
    >
      {/* Add hidden audio element */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Optional: Add a subtle connection status indicator for debugging */}
      <div
        className={`connection-status ${connectionStatus} absolute bottom-2 right-2 text-xs opacity-50`}
      >
        {connectionStatus === "connected"
          ? "Socket Connected"
          : connectionStatus === "error"
          ? "Connection Error"
          : "Disconnected"}
      </div>

      {/* Use AnimatePresence for entry/exit animations */}
      <AnimatePresence>
        {isVisible && alertData && (
          <motion.div
            key={themeName} // Use themeName as key to ensure re-animation on theme change
            initial={currentTheme.animation.initial}
            animate={currentTheme.animation.animate}
            exit={currentTheme.animation.exit}
            transition={currentTheme.animation.transition}
            // Combine container classes with rounded-lg and shadow defaults
            className={`shadow-xl max-w-sm w-full overflow-hidden ${currentTheme.containerClasses}`}
            onAnimationStart={() =>
              console.log(`🎭 TipAlert: Alert animation started`)
            }
            onAnimationComplete={() =>
              console.log(`🎭 TipAlert: Alert animation completed`)
            }
          >
            {/* Header part */}
            <div
              className={`${currentTheme.headerClasses} flex justify-between items-center gap-2`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {" "}
                {/* min-w-0 prevents overflow */}
                {IconComponent && (
                  <IconComponent className="h-4 w-4 opacity-80 flex-shrink-0" />
                )}
                <p
                  className={`${currentTheme.nameClasses} truncate flex-shrink`}
                >
                  {alertData.name}
                </p>
              </div>
              <p className={`${currentTheme.amountClasses} flex-shrink-0`}>
                {alertData.amount}
              </p>
            </div>
            {/* Message part (only if message exists) */}
            {alertData.message && (
              <div className={`${currentTheme.bodyClasses}`}>
                <p className={`${currentTheme.messageClasses} break-words`}>
                  {alertData.message}
                </p>
              </div>
            )}
            {/* If no message, show a minimal body only if theme doesn't define header only */}
            {showMinimalBody && (
              // Ensure some height even without message, using body classes for consistency
              <div className={`${currentTheme.bodyClasses} min-h-[1rem]`}></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add a declaration for the custom property on the window object
declare global {
  interface Window {
    tipAlertTimers?: {
      timer: NodeJS.Timeout;
      resetTimer: NodeJS.Timeout;
      displayTimeout: NodeJS.Timeout;
    };
    testTip?: (tipData?: Partial<TestTip>) => string;
    tipHelp?: () => string;
  }
}
