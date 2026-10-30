import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showWordmark?: boolean;
  href?: string;
}

export function Logo({
  className = "",
  size = "md",
  showWordmark = true,
  href = "/",
}: LogoProps) {
  const sizeMap = {
    sm: { icon: "w-6 h-6", text: "text-lg", tracking: "tracking-[0.18em]" },
    md: { icon: "w-8 h-8", text: "text-xl", tracking: "tracking-[0.2em]" },
    lg: { icon: "w-10 h-10", text: "text-2xl", tracking: "tracking-[0.22em]" },
    xl: { icon: "w-14 h-14", text: "text-3xl", tracking: "tracking-[0.25em]" },
  };

  const config = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Cinematic Film Frame Icon */}
      <div className={`relative ${config.icon} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_8px_rgba(197,164,109,0.3)]"
        >
          <defs>
            <linearGradient id="goldGradComp" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E0C18B" />
              <stop offset="1" stopColor="#C5A46D" />
            </linearGradient>
            <linearGradient id="innerGradComp" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C5A46D" stopOpacity="0.25" />
              <stop offset="1" stopColor="#1B1B21" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <rect x="4" y="4" width="40" height="40" rx="8" stroke="url(#goldGradComp)" strokeWidth="2.5" fill="#1B1B21" />
          <rect x="9" y="8" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="17" y="8" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="27" y="8" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="35" y="8" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="9" y="36" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="17" y="36" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="27" y="36" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="35" y="36" width="4" height="4" rx="1" fill="url(#goldGradComp)" />
          <rect x="14" y="16" width="20" height="16" rx="3" stroke="url(#goldGradComp)" strokeWidth="1.5" fill="url(#innerGradComp)" />
          <path d="M22 20L29 24L22 28V20Z" fill="url(#goldGradComp)" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-serif font-bold text-cinema-text ${config.text} ${config.tracking} leading-none`}
          >
            FILM<span className="text-gold">FOLIO</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-cinema-muted/70 font-sans mt-0.5">
            Cinematic Journal
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded">
        {content}
      </Link>
    );
  }

  return content;
}
