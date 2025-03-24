import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { TwinClassStatusesTable } from "@/widgets/tables";

export function TwinStatusesScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Statuses", href: `/${PlatformArea.core}/statuses` },
    ]);
  }, []);

  return <TwinClassStatusesTable />;
}
