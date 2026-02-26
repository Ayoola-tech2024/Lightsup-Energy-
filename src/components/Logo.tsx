import React from 'react';
import { motion } from 'motion/react';

export const Logo = ({ className = "h-24" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="/logo.png"
        alt="Lightsup Energy"
        className="h-full w-auto object-contain"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if image is missing
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};
