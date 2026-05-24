"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({ delay = 0, duration = 0.5, className = "", children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
