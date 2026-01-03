"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="loader mb-6" />
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
            Quietly Building
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
