import { useEffect } from "react";

type Options = {
  onLeft?: () => void;
  onRight?: () => void;
};

export function useKeyboardNavigation({ onLeft, onRight }: Options) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onLeft?.();
      } else if (e.key === "ArrowRight") {
        onRight?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onLeft, onRight]);
}
