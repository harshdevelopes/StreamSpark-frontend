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

  // Check URL search params for a test alert
  useEffect(() => {
    const name = searchParams.get("name");
    const amount = searchParams.get("amount");
    const currency = searchParams.get("currency") as CurrencyCode;
    const message = searchParams.get("message");
    const theme = searchParams.get("theme") as ThemeName;

    if (name && amount && currency) {
      // Simulate test tip from URL params
      triggerTestAlert({
        name,
        amount,
        currency,
        message: message || undefined,
        theme: theme || undefined,
      });
    }
  }, [searchParams]);

  // Handle tip alert display logic
  const handleTipAlert = useCallback((data: any) => {
    console.log("Tip Alert Data:", data);

    // Cancel any existing timers
    if (window.tipAlertTimers) {
      clearTimeout(window.tipAlertTimers.timer);
      clearTimeout(window.tipAlertTimers.resetTimer);
      clearTimeout(window.tipAlertTimers.displayTimeout);
    }

    // Set the theme (fallback to default if not found)
    const newThemeName = (data.theme || "default") as ThemeName;
    const newTheme = themes[newThemeName] || themes.default;
    setThemeName(newThemeName);
    setCurrentTheme(newTheme);

    // Get approximate USD value for duration calculation
    const amountNum = parseFloat(data.amount);
    const currency = data.currency as CurrencyCode;
    const rate = SUPPORTED_CURRENCIES[currency]?.usdRate || 1;
    const usdValue = amountNum * rate;

    // Set duration based on amount
    const newDuration = getDuration(usdValue);
    setDuration(newDuration);

    // Set alert data and trigger animation
    setAlertData(data);

    // Display the alert after a short delay
    window.tipAlertTimers = {
      displayTimeout: setTimeout(() => {
        setIsVisible(true);

        // Play sound if provided
        if (data.soundUrl && audioRef.current) {
          audioRef.current.src = data.soundUrl;
          audioRef.current.play().catch((err) => {
            console.error("Failed to play audio:", err);
          });
        }

        // Hide after duration
        window.tipAlertTimers.timer = setTimeout(() => {
          setIsVisible(false);

          // Reset state after animation is complete
          window.tipAlertTimers.resetTimer = setTimeout(() => {
            setAlertData(null);
          }, 500); // Match exit animation duration
        }, newDuration);
      }, 100),
    } as any;
  }, []);

  // Function to trigger a test alert
  const triggerTestAlert = useCallback(
    (testData?: Partial<TestTip>) => {
      const defaultTestData: TestTip = {
        name: "TestViewer123",
        amount: "10.00",
        currency: "USD",
        message: "This is a test message. Thanks for the great content!",
        theme: "default",
      };

      const tipData = { ...defaultTestData, ...testData };

      handleTipAlert(tipData);
      return `Test tip triggered: ${tipData.amount} ${tipData.currency} from ${tipData.name}`;
    },
    [handleTipAlert]
  );

  // Expose test functions to window for easy testing via browser console
  useEffect(() => {
    // Add test helpers to window object
    window.testTip = triggerTestAlert;
    window.tipHelp = () => {
      return `
        Usage:
        testTip() - Trigger default test tip
        testTip({name: "User", amount: "5.00", currency: "USD", message: "Hi!", theme: "cyberpunk"})
        
        Available themes: ${Object.keys(themes).join(", ")}
      `;
    };

    // Cleanup
    return () => {
      if (window.tipAlertTimers) {
        clearTimeout(window.tipAlertTimers.timer);
        clearTimeout(window.tipAlertTimers.resetTimer);
        clearTimeout(window.tipAlertTimers.displayTimeout);
      }
      delete window.testTip;
      delete window.tipHelp;
    };
  }, [triggerTestAlert]);

  // Render the component
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <audio ref={audioRef} />

      <AnimatePresence>
        {isVisible && alertData && (
          <motion.div
            key="tip-alert"
            initial={currentTheme.animation.initial}
            animate={currentTheme.animation.animate}
            exit={currentTheme.animation.exit}
            transition={currentTheme.animation.transition}
            className={`w-96 max-w-full pointer-events-none shadow-xl ${currentTheme.containerClasses}`}
          >
            {/* Header section */}
            <div className={currentTheme.headerClasses}>
              <div className="flex items-center gap-2">
                {React.createElement(currentTheme.icon, {
                  className: "h-4 w-4",
                })}
                <span>New Tip!</span>
              </div>
            </div>

            {/* Body section */}
            <div className={currentTheme.bodyClasses}>
              <div className={currentTheme.nameClasses}>{alertData.name}</div>
              <div className={currentTheme.amountClasses}>
                {SUPPORTED_CURRENCIES[alertData.currency]?.symbol || "$"}
                {alertData.amount} {alertData.currency}
              </div>
              {alertData.message && (
                <div className={currentTheme.messageClasses}>
                  {alertData.message}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Add type extensions for window
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
