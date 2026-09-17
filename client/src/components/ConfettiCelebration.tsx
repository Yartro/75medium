import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";

export function ConfettiCelebration({ achieved }: { achieved: boolean }) {
  const prev = useRef<boolean | null>(null);

  useEffect(() => {
    if (prev.current === false && achieved === true) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#5f9c4f", "#eee7d8", "#9c968a", "#3a3d3f"],
      });
    }
    prev.current = achieved;
  }, [achieved]);

  return null;
}
