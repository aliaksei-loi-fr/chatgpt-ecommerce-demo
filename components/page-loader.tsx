"use client";

import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[200px]"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="block w-8 h-8 border-3 border-[var(--chatgpt-accent)] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-[var(--chatgpt-text-secondary)]">
          Loading...
        </span>
      </div>
    </motion.div>
  );
}
