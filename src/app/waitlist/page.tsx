"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { useJoinWaitlist } from "@/lib/api";

const API_BASE_URL = "http://localhost:8000/api";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "twitch",
    username: "",
  });

  const waitlistMutation = useJoinWaitlist({
    onSuccess: () => {
      console.log("Successfully joined waitlist!");
      setFormData({
        name: "",
        email: "",
        platform: "twitch",
        username: "",
      });
    },
    onError: (error) => {
      console.error("Failed to join waitlist:", error.message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (waitlistMutation.error) waitlistMutation.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      console.error("Email is required");
      return;
    }
    waitlistMutation.mutate({ email: formData.email });
  };

  if (waitlistMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
            alt="Background pattern"
            fill
            className="object-cover"
          />
        </div>

        <div className="max-w-md mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 text-center"
          >
            <div className="mb-6">
              <Image
                src="https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=2070&auto=format&fit=crop"
                alt="SuperTip Logo"
                width={80}
                height={80}
                className="mx-auto rounded-full border-4 border-purple-600 shadow-lg"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Joining!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We've received your email and will be in touch soon!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Return to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 opacity-5">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
          alt="Background pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8"
        >
          <div className="mb-6 text-center">
            <Image
              src="https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=2070&auto=format&fit=crop"
              alt="SuperTip Logo"
              width={80}
              height={80}
              className="mx-auto rounded-full border-4 border-purple-600 shadow-lg"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Join the Waitlist
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Be among the first to experience SuperTip
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="platform"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Streaming Platform
              </label>
              <select
                id="platform"
                name="platform"
                required
                value={formData.platform}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a platform</option>
                <option value="twitch">Twitch</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {waitlistMutation.isError && (
              <div className="text-red-600 dark:text-red-400 text-sm">
                {waitlistMutation.error.message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={waitlistMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {waitlistMutation.isPending ? "Submitting..." : "Join Waitlist"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <FaArrowLeft className="inline mr-1" />
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
