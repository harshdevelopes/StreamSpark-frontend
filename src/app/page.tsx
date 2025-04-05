"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaCreditCard,
  FaBell,
  FaPalette,
  FaChartLine,
  FaPercentage,
  FaPuzzlePiece,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      {/* Hero Section with Background */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Update Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          {/* Using a more abstract gradient or subtle pattern might fit better */}
          {/* <Image ... /> */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-slate-100/0 dark:from-indigo-800/30 dark:via-purple-800/20 dark:to-slate-900/0"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              {/* Keep logo or update if needed */}
              <Image
                src="https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=2070&auto=format&fit=crop"
                alt="SuperTip Logo"
                width={120}
                height={120}
                className="mx-auto rounded-full border-4 border-indigo-500 shadow-lg"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              // Update text colors
              className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6"
            >
              #1 Tipping Platform for Live Streamers
            </motion.h1>

            <motion.p // Added subtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-xl mx-auto text-lg text-slate-600 dark:text-slate-300"
            >
              Engage your audience and monetize your stream seamlessly with
              personalized tipping pages and real-time alerts.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 space-x-4"
            >
              <Link
                href="/waitlist"
                // Update button styles
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Join the Waitlist
                <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/login" // Changed from /dashboard to /login
                // Update button styles
                className="inline-flex items-center px-8 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-lg text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm hover:shadow-md"
              >
                Streamer Login
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      {/* Update section background */}
      <section className="py-16 bg-white dark:bg-slate-800/50 relative">
        {/* Remove decorative element or adjust */}
        {/* <div className="absolute top-0 left-0 w-full h-24 ..."></div> */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            {/* Update heading color */}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              How to Use?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Update card styles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              // Update card background, shadow, border
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              {/* Update icon/step colors */}
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                Step 1
              </div>
              {/* Update text colors */}
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Visit Streamer's SuperTip Page
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Find your favorite streamer's dedicated tipping page.
              </p>
            </motion.div>

            {/* Repeat style updates for Step 2 and Step 3 cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                Step 2
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Fill in your amount, name & message
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Customize your tip with a personal message.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                Step 3
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Complete the Payment
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Use your preferred payment method to send the tip.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Use SuperTip Section */}
      {/* Update section background */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 relative">
        {/* Update or remove background pattern */}
        <div className="absolute inset-0 opacity-5 mix-blend-multiply">
          {/* Example subtle pattern */}
          {/* <svg ... /> */}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            {/* Update heading color */}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Why Use SuperTip as a LiveStreamer?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Update card styles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Update icon colors */}
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <FaCreditCard size={32} />
              </div>
              {/* Update text colors */}
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Multiple Payment Methods
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Accept payments via UPI, Debit Card, Credit Card and more!
              </p>
            </motion.div>

            {/* Repeat style updates for other feature cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <FaBell size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Realtime Alert on LiveStream
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Show realtime alert on your stream and maximise engagement!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <FaPalette size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Personalized SuperTip Page
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get personalized tipping page with your branding!
              </p>
            </motion.div>

            {/* ... (Apply styling to remaining feature cards) ... */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <FaChartLine size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Diversify your Income
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Diversify your income beyond traditional methods like ads and
                sponsorships!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <FaPercentage size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Improved Revenue Share
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Lower platform fees means you get larger portion of your tips!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                <FaPuzzlePiece size={32} />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                Custom Widgets
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get custom goal widgets and more for your livestreams!
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* Update section background */}
      <section className="py-16 bg-white dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            {/* Update heading color */}
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              What Streamers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Update card styles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
                    alt="Streamer"
                    fill
                    className="rounded-full object-cover ring-2 ring-indigo-300"
                  />
                </div>
                <div>
                  {/* Update text colors */}
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    Sarah Johnson
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Twitch Streamer
                  </p>
                </div>
              </div>
              {/* Update text colors */}
              <p className="text-slate-600 dark:text-slate-300 italic">
                "SuperTip has completely transformed how I monetize my streams.
                The setup was easy and my viewers love the tipping experience!"
              </p>
            </motion.div>

            {/* Repeat style updates for other testimonial cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop"
                    alt="Streamer"
                    fill
                    className="rounded-full object-cover ring-2 ring-indigo-300"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    Michael Chen
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    YouTube Creator
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 italic">
                "The real-time alerts on my streams have increased engagement
                significantly. My viewers love seeing their tips appear
                instantly!"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop"
                    alt="Streamer"
                    fill
                    className="rounded-full object-cover ring-2 ring-indigo-300"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">
                    Emily Rodriguez
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Instagram Live
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 italic">
                "The personalized tipping page with my branding has made a huge
                difference. It feels like a seamless extension of my content!"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      {/* Update section background and text colors */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Update or remove pattern */}
        <div className="absolute inset-0 opacity-10">{/* <Image ... /> */}</div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the Waitlist
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            SuperTip is currently available to a limited number of streamers,
            join our waitlist to access SuperTip when it's available!
          </p>
          {/* Update button style */}
          <Link
            href="/waitlist"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 transition-colors duration-300 transform hover:scale-105"
          >
            Join Now
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      {/* Update footer background and text */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                {/* Update logo if needed */}
                <Image
                  src="https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?q=80&w=2070&auto=format&fit=crop"
                  alt="SuperTip Logo"
                  width={40}
                  height={40}
                  className="rounded-full mr-2 opacity-80"
                />
                <p className="text-sm">
                  © {new Date().getFullYear()} Supertip. All rights reserved.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link
                href="/community-guidelines"
                className="text-sm hover:text-indigo-300 transition-colors"
              >
                Community Guidelines
              </Link>
              <Link
                href="/terms"
                className="text-sm hover:text-indigo-300 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-indigo-300 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/refund"
                className="text-sm hover:text-indigo-300 transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                href="/contact"
                className="text-sm hover:text-indigo-300 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700 text-center text-sm">
            <p>SuperTip by RahulDF</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
