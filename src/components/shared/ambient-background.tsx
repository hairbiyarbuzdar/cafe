"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Sits behind page content as a fixed pointer-events-none layer.
 * Three slow-drifting radial gradients + a faint dotted grid create
 * the premium "ambient" look. Honors `prefers-reduced-motion`.
 *
 * Color stops are read from `--ambient-1/2/3` so the layer adapts
 * to light and dark themes without conditional logic.
 */
export function AmbientBackground() {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(var(--ambient-grid) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse at top, black 30%, transparent 75%)",
        }}
      />

      <Orb
        className="-left-32 top-[-12%] h-[520px] w-[520px]"
        color="var(--ambient-1)"
        animate={
          reduce
            ? undefined
            : { x: [0, 40, -12, 0], y: [0, -18, 22, 0] }
        }
        duration={42}
      />
      <Orb
        className="right-[-10%] top-[18%] h-[420px] w-[420px]"
        color="var(--ambient-2)"
        animate={
          reduce
            ? undefined
            : { x: [0, -30, 18, 0], y: [0, 24, -12, 0] }
        }
        duration={56}
      />
      <Orb
        className="left-[35%] bottom-[-15%] h-[440px] w-[440px]"
        color="var(--ambient-3)"
        animate={
          reduce
            ? undefined
            : { x: [0, 24, -18, 0], y: [0, -16, 20, 0] }
        }
        duration={64}
      />
    </div>
  );
}

type OrbProps = {
  className: string;
  color: string;
  animate?: { x: number[]; y: number[] };
  duration: number;
};

function Orb({ className, color, animate, duration }: OrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{
        background: `radial-gradient(closest-side, ${color}, transparent 70%)`,
      }}
      initial={false}
      animate={animate}
      transition={
        animate
          ? {
              duration,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }
          : undefined
      }
    />
  );
}
