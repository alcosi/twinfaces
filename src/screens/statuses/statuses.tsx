import { TwinClassStatusesTable } from "@/widgets/tables";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";

export function TwinStatusesScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Statuses", href: "/workspace/statuses" }]);
  }, []);

  return <TwinClassStatusesTable />;
}
