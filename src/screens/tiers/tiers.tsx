import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { TiersTable } from "@/widgets/tables/tiers";

export function TiersScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Tiers", href: "/workspace/tiers" }]);
  }, [setBreadcrumbs]);

  return <TiersTable />;
}
