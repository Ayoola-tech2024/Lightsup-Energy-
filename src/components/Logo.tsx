import React, { useState } from 'react';

export const Logo = ({ className = "h-24" }: { className?: string }) => {
  const [error, setError] = useState(false);
  const logoPath = `${import.meta.env.BASE_URL}logo.png`;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {!error ? (
        <img
          src={logoPath}
          alt="Lightsup Energy"
          className="h-full w-auto block object-contain"
          onError={(e) => {
            console.error("Logo load error:", e);
            setError(true);
          }}
          loading="eager"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="font-bold text-xl text-[var(--color-primary)] leading-none">LIGHTSUP</span>
          <span className="text-[8px] text-gray-500 font-bold tracking-widest">ENERGY</span>
        </div>
      )}
    </div>
  );
};
