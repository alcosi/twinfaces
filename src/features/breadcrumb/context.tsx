import { createContext } from "react";
import { Context } from "./types";

export const BreadcrumbContext = createContext<Context | undefined>(undefined);
