import { createContext } from "react";
import { QuickViewContextType } from "./types";

export const QuickViewContext = createContext<QuickViewContextType | undefined>(
  undefined
);
