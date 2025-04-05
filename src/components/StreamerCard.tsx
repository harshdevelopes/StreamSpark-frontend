import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaTwitch, FaYoutube, FaTwitter } from "react-icons/fa";

interface StreamerCardProps {
  id: string;
  name: string;
  imageUrl: string;
  twitchUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
}

const StreamerCard: React.FC<StreamerCardProps> = ({
  id,
  name,
  imageUrl,
  twitchUrl,
  youtubeUrl,
  twitterUrl,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
    >
      <div className="relative h-48 w-full">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {name}
        </h3>
        <div className="flex space-x-3 mt-3">
          {twitchUrl && (
            <a
              href={twitchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
            >
              <FaTwitch size={20} />
            </a>
          )}
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            >
              <FaYoutube size={20} />
            </a>
          )}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FaTwitter size={20} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StreamerCard;
