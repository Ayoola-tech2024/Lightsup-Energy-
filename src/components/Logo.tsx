import React from 'react';
import { motion } from 'motion/react';

export const Logo = ({ className = "h-8" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bulb Outline - Dark Indigo */}
        <path
          d="M50 5C27.9 5 10 22.9 10 45C10 59.6 17.9 72.4 30 79.5V95C30 97.8 32.2 100 35 100H65C67.8 100 70 97.8 70 95V79.5C82.1 72.4 90 59.6 90 45C90 22.9 72.1 5 50 5ZM60 90H40V85H60V90ZM60 80H40V75H60V80Z"
          stroke="var(--color-secondary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Lightning Bolt - Cyan */}
        <motion.path
          d="M55 25L40 50H55L45 70L65 45H50L55 25Z"
          fill="var(--color-primary)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
        />
      </motion.svg>
      <div className="flex flex-col justify-center">
        <span className="font-display font-bold text-lg leading-none tracking-wider text-[var(--color-primary)]">
          LIGHTSUP
        </span>
        <span className="font-display font-bold text-sm leading-none tracking-widest text-[var(--color-primary)] opacity-80">
          ENERGY
        </span>
      </div>
    </div>
  );
};
