import { createContext } from "react";
import { type Context } from "./types";

export const BreadcrumbContext = createContext<Context | undefined>(undefined);
