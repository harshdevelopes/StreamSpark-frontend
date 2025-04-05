import React from "react";
import { motion } from "framer-motion";
import StreamerCard from "./StreamerCard";

// Sample data for featured streamers
const featuredStreamers = [
  {
    id: "1",
    name: "GamingPro123",
    imageUrl:
      "https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=1000&auto=format&fit=crop",
    twitchUrl: "https://twitch.tv/gamingpro123",
    youtubeUrl: "https://youtube.com/gamingpro123",
    twitterUrl: "https://twitter.com/gamingpro123",
  },
  {
    id: "2",
    name: "StreamQueen",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    twitchUrl: "https://twitch.tv/streamqueen",
    twitterUrl: "https://twitter.com/streamqueen",
  },
  {
    id: "3",
    name: "TechReviewer",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    youtubeUrl: "https://youtube.com/techreviewer",
    twitterUrl: "https://twitter.com/techreviewer",
  },
  {
    id: "4",
    name: "ArtStreamer",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
    twitchUrl: "https://twitch.tv/artstreamer",
    instagramUrl: "https://instagram.com/artstreamer",
  },
];

const StreamerGrid: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8"
        >
          Featured Streamers
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredStreamers.map((streamer, index) => (
            <motion.div
              key={streamer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StreamerCard {...streamer} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StreamerGrid;
