import { ReactNode } from "react";

export type QuickViewContextType = {
  openQuickView: (content: ReactNode) => void;
  closeQuickView: () => void;
};
