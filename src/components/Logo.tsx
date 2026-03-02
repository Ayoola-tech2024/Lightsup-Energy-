import React from 'react';

export const Logo = ({ className = "h-24" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/logo.png"
        alt="Lightsup Energy"
        className="h-full w-auto object-contain"
      />
    </div>
  );
};
