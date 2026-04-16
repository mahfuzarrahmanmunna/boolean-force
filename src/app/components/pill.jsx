"use client";

import { cn } from "../../lib/utils";

// simple px helper (since it was missing)
const px = (value) => `${value}px`;

export const Pill = ({ children, className }) => {
  const polyRoundness = 6;
  const hypotenuse = polyRoundness * 2;
  const hypotenuseHalf = polyRoundness / 2 - 1.5;

  return (
    <div
      style={{
        "--poly-roundness": px(polyRoundness),
      }}
      className={cn(
        "bg-[#262626]/50 transform-gpu font-medium text-white/60 backdrop-blur-sm font-mono text-sm inline-flex items-center justify-center px-3 h-8 border border-white/10 [clip-path:polygon(var(--poly-roundness)_0,calc(100%_-_var(--poly-roundness))_0,100%_var(--poly-roundness),100%_calc(100%_-_var(--poly-roundness)),calc(100%_-_var(--poly-roundness))_100%,var(--poly-roundness)_100%,0_calc(100%_-_var(--poly-roundness)),0_var(--poly-roundness))]",
        className
      )}
    >
      {/* Corner lines */}
      <span
        style={{ "--h": px(hypotenuse), "--hh": px(hypotenuseHalf) }}
        className="absolute inline-block w-[var(--h)] top-[var(--hh)] left-[var(--hh)] h-[2px] -rotate-45 origin-top -translate-x-1/2 bg-white/20"
      />
      <span
        style={{ "--h": px(hypotenuse), "--hh": px(hypotenuseHalf) }}
        className="absolute w-[var(--h)] top-[var(--hh)] right-[var(--hh)] h-[2px] bg-white/20 rotate-45 translate-x-1/2"
      />
      <span
        style={{ "--h": px(hypotenuse), "--hh": px(hypotenuseHalf) }}
        className="absolute w-[var(--h)] bottom-[var(--hh)] left-[var(--hh)] h-[2px] bg-white/20 rotate-45 -translate-x-1/2"
      />
      <span
        style={{ "--h": px(hypotenuse), "--hh": px(hypotenuseHalf) }}
        className="absolute w-[var(--h)] bottom-[var(--hh)] right-[var(--hh)] h-[2px] bg-white/20 -rotate-45 translate-x-1/2"
      />

      {/* Dot */}
      <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 mr-2 shadow-md shadow-blue-500/50" />

      {children}
    </div>
  );
};