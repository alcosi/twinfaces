import { useContext, useEffect } from "react";
import { BreadcrumbContext } from "./context";

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);

  useEffect(() => {
    return () => {
      context?.setBreadcrumbs([]);
    };
  }, []);

  if (context === undefined) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }

  return context;
};
