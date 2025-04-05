import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-4 px-6 md:px-8 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-purple-600 dark:text-purple-400"
          >
            Supertip
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
          >
            Login / Sign Up
          </Link>
        </motion.div>
      </div>
    </nav>
  );
};

export default Navbar;
