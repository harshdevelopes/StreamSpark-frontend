"use client";

import { FC, useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Confetti from "react-confetti";
import {
  FaTwitch,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";
import { useCreateTipOrder, useVerifyTip } from "@/lib/api"; // Import hooks

const API_BASE_URL = "http://localhost:8000/api";

// Define supported currencies
const SUPPORTED_CURRENCIES = {
  INR: { symbol: "₹", factor: 100 },
  USD: { symbol: "$", factor: 100 },
  EUR: { symbol: "€", factor: 100 },
  GBP: { symbol: "£", factor: 100 },
};

type CurrencyCode = keyof typeof SUPPORTED_CURRENCIES;

interface StreamerProfileProps {
  params: {
    username: string;
  };
}

const StreamerProfile: FC<StreamerProfileProps> = ({ params }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("INR");
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tipId, setTipId] = useState<string | null>(null);

  // --- React Query Mutations ---
  const createOrderMutation = useCreateTipOrder();
  const verifyTipMutation = useVerifyTip();

  const streamer = {
    username: params.username,
    displayName: "Sample Streamer",
    avatar: "/images/default-avatar.png",
    coverImage: "/images/default-cover.png",
    bio: "Professional streamer passionate about gaming and community building",
    followers: 10000,
    totalTips: 5000,
    socialLinks: {
      twitch: "https://twitch.tv/sample",
      youtube: "https://youtube.com/sample",
      instagram: "https://instagram.com/sample",
      twitter: "https://twitter.com/sample",
    },
  };

  const MAX_TIP_AMOUNT_INR = 50000; // Set maximum tip limit (e.g., 50,000 INR)
  // Approximate limits for other currencies (replace with better logic if needed)
  const MAX_TIP_AMOUNT_USD = 600;
  const MAX_TIP_AMOUNT_EUR = 550;
  const MAX_TIP_AMOUNT_GBP = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Reset mutation states if needed, though usually handled by re-triggering
    // createOrderMutation.reset();
    // verifyTipMutation.reset();

    // --- Validation (keep as is) ---
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (selectedCurrency === "INR" && numericAmount > MAX_TIP_AMOUNT_INR) {
      setError(
        `Tip amount cannot exceed ₹${MAX_TIP_AMOUNT_INR.toLocaleString()}.`
      );
      return;
    } else if (
      selectedCurrency === "USD" &&
      numericAmount > MAX_TIP_AMOUNT_USD
    ) {
      setError(
        `Tip amount cannot exceed $${MAX_TIP_AMOUNT_USD.toLocaleString()}.`
      );
      return;
    } else if (
      selectedCurrency === "EUR" &&
      numericAmount > MAX_TIP_AMOUNT_EUR
    ) {
      setError(
        `Tip amount cannot exceed €${MAX_TIP_AMOUNT_EUR.toLocaleString()}.`
      );
      return;
    } else if (
      selectedCurrency === "GBP" &&
      numericAmount > MAX_TIP_AMOUNT_GBP
    ) {
      setError(
        `Tip amount cannot exceed £${MAX_TIP_AMOUNT_GBP.toLocaleString()}.`
      );
      return;
    }
    // --- End Validation ---

    // Trigger Order Creation Mutation
    createOrderMutation.mutate(
      {
        amount: numericAmount,
        currency: selectedCurrency,
        targetUsername: streamer.username,
      },
      {
        onSuccess: (orderData) => {
          console.log("Order created:", orderData);
          // TODO :: Uncomment this once we have a working Razorpay implementation
          // if (
          //   !orderData ||
          //   !orderData.orderId ||
          //   !orderData.providerKeyId ||
          //   !orderData.tipId
          // ) {
          //   setError("Received invalid order data from server.");
          //   return;
          // }
          // setTipId(orderData.tipId || ""); // Store tipId for verification
          // console.log("Tip ID:", orderData.tipId);
          // --- Initialize Payment Provider ---
          // initializeRazorpay(orderData);
          //--------------------------------
          verifyTipMutation.mutate(
            {
              paymentId: orderData.razorpay_payment_id || "",
              orderId: orderData.orderId || "",
              signature: orderData.razorpay_signature || "",
              tipId: orderData.tipId || "", // Use the tipId stored in state
            },
            {
              onSuccess: (verifyData) => {
                console.log("Payment Verification Success:", verifyData);
                setShowSuccess(true);
                setAmount("");
                setMessage("");
                setError(null);
              },
              onError: (error) => {
                console.error("Payment verification failed:", error);
                setError(
                  error.message ||
                    "Payment succeeded but verification failed. Contact support."
                );
              },
            }
          );
        },
        onError: (error) => {
          console.error("Order creation failed:", error);
          setError(error.message || "Could not initiate tip process.");
        },
      }
    );
  };

  // --- Initialize Razorpay (separated logic) ---
  const initializeRazorpay = async (orderData: {
    orderId: string;
    tipId: string;
    providerKeyId: string;
  }) => {
    const paymentAmount =
      parseInt(amount) *
      (SUPPORTED_CURRENCIES[selectedCurrency]?.factor || 100);

    const options = {
      key: orderData.providerKeyId,
      amount: paymentAmount.toString(),
      currency: selectedCurrency,
      name: "SuperTip",
      description: `Tip for ${streamer.displayName}`,
      image: "/images/default-avatar.png",
      order_id: orderData.orderId,
      handler: (razorpayResponse: any) => {
        console.log("Razorpay Success Response:", razorpayResponse);
        // Trigger Verification Mutation
        verifyTipMutation.mutate(
          {
            paymentId: razorpayResponse.razorpay_payment_id,
            orderId: razorpayResponse.razorpay_order_id,
            signature: razorpayResponse.razorpay_signature,
            tipId: tipId, // Use the tipId stored in state
          },
          {
            onSuccess: (verifyData) => {
              console.log("Payment Verification Success:", verifyData);
              setShowSuccess(true);
              setAmount("");
              setMessage("");
              setError(null);
            },
            onError: (error) => {
              console.error("Payment verification failed:", error);
              setError(
                error.message ||
                  "Payment succeeded but verification failed. Contact support."
              );
            },
          }
        );
      },
      prefill: {},
      notes: {
        address: "SuperTip Transaction",
        message: message,
        streamer_username: streamer.username,
        internal_tip_id: orderData.tipId,
      },
      theme: {
        color: "#6366F1",
      },
    };

    // TODO :: Uncomment this once we have a working Razorpay implementation
    // // --- Load Razorpay Script and Open ---
    // const loadScriptRes = await loadRazorpayScript(
    //   "https://checkout.razorpay.com/v1/checkout.js"
    // );
    // if (!loadScriptRes) {
    //   setError("Razorpay SDK failed to load. Are you online?"); // Show error via state
    //   // Need to potentially reset createOrderMutation loading state if script fails
    //   createOrderMutation.reset();
    //   return;
    // }
    // try {
    //   // @ts-ignore
    //   const paymentObject = new window.Razorpay(options);
    //   paymentObject.on("payment.failed", function (failResponse: any) {
    //     console.error("Razorpay Payment Failed:", failResponse);
    //     setError(
    //       `Payment failed: ${failResponse.error.description}. Code: ${failResponse.error.code}`
    //     );
    //     // Reset mutations if payment fails externally
    //     createOrderMutation.reset();
    //     verifyTipMutation.reset();
    //   });
    //   paymentObject.open();
    // } catch (error) {
    // console.error("Failed to initialize Razorpay:", error);
    // setError("Could not display payment window. Please try again.");
    // createOrderMutation.reset(); // Reset loading state on error
    // }
  };

  // --- Helper to load Razorpay script (Keep as is) ---
  const loadRazorpayScript = (src: string) => {
    // ... (implementation remains the same)
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- Calculate combined loading/error state ---
  const isProcessing =
    createOrderMutation.isPending || verifyTipMutation.isPending;
  const mutationError = createOrderMutation.error || verifyTipMutation.error;

  return (
    <>
      {showSuccess && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Mobile-optimized layout */}
        <div className="flex flex-col md:flex-row h-screen">
          {/* Left side - Profile info (hidden on mobile) */}
          <div className="hidden md:block md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 overflow-y-auto">
            <div className="sticky top-6">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 blur-md"></div>
                <Image
                  src={streamer.avatar}
                  alt={streamer.displayName}
                  fill
                  className="rounded-full object-cover ring-4 ring-white shadow-xl"
                />
              </div>

              <h1 className="text-2xl font-bold text-white text-center mb-2">
                {streamer.displayName}
              </h1>
              <p className="text-white/80 text-center mb-6">{streamer.bio}</p>

              <div className="flex justify-center gap-4 mb-6">
                {Object.entries(streamer.socialLinks).map(
                  ([platform, link]) => (
                    <motion.a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {platform === "twitch" && <FaTwitch size={22} />}
                      {platform === "youtube" && <FaYoutube size={22} />}
                      {platform === "instagram" && <FaInstagram size={22} />}
                      {platform === "twitter" && <FaTwitter size={22} />}
                    </motion.a>
                  )
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">
                    {streamer.followers.toLocaleString()}
                  </p>
                  <p className="text-white/80">Followers</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">
                    ₹{streamer.totalTips.toLocaleString()}
                  </p>
                  <p className="text-white/80">Total Tips</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Tip form (full width on mobile) */}
          <div className="w-full md:w-2/3 flex flex-col">
            {/* Mobile header (visible only on mobile) */}
            <div className="md:hidden bg-gradient-to-r from-indigo-600 to-purple-700 p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={streamer.avatar}
                    alt={streamer.displayName}
                    fill
                    className="rounded-full object-cover ring-2 ring-white"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">
                    {streamer.displayName}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {streamer.followers.toLocaleString()} followers
                  </p>
                </div>
              </div>
            </div>

            {/* Tip form */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
              >
                <div className="flex items-center gap-2 mb-6">
                  <FaHeart className="text-red-500" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Support {streamer.displayName}
                  </h2>
                </div>

                {showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      Thank you for your support!
                    </h3>
                    <p className="text-slate-600">
                      Your tip has been sent successfully.
                    </p>
                    {/* Add button to tip again */}
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="mt-6 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                    >
                      Send Another Tip
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Currency Selector */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Select Currency
                      </label>
                      <div className="flex space-x-2">
                        {(
                          Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]
                        ).map((currency) => (
                          <button
                            key={currency}
                            type="button"
                            onClick={() => setSelectedCurrency(currency)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                              selectedCurrency === currency
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                          >
                            {currency}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Amount ({SUPPORTED_CURRENCIES[selectedCurrency].symbol})
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {SUPPORTED_CURRENCIES[selectedCurrency].symbol}
                        </span>
                        <input
                          id="amount"
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            setAmount(e.target.value);
                            setError(null);
                          }}
                          placeholder="Enter amount"
                          className={`w-full pl-8 pr-4 py-3 rounded-lg border ${
                            error || mutationError
                              ? "border-red-500 focus:ring-red-300 focus:border-red-500"
                              : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-300"
                          } transition-all text-slate-900`}
                          min="1"
                          required
                          disabled={isProcessing}
                        />
                        {(error || mutationError) && (
                          <p className="mt-1 text-xs text-red-600">
                            {error ||
                              mutationError?.message ||
                              "An error occurred"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Message (optional)
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a message"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all text-slate-900"
                        rows={3}
                        disabled={isProcessing}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Processing...
                        </>
                      ) : (
                        <>
                          Send Tip <FaArrowRight />
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StreamerProfile;
