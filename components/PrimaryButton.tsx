"use client";

import { motion } from "framer-motion";

interface PrimaryButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function PrimaryButton({
  label,
  onClick,
  disabled,
}: PrimaryButtonProps) {
  return (
    <motion.button
      className="btn"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {label}

      <style jsx>{`
        .btn {
          width: 100%;
          padding: 22px 24px;
          border-radius: 999px;
          background: var(--amber);
          color: #1a1300;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.01em;
          box-shadow:
            0 8px 24px rgba(245, 180, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.18);
          transition: opacity 200ms ease;
        }
        .btn:disabled {
          opacity: 0.5;
        }
      `}</style>
    </motion.button>
  );
}
