import { useEffect } from "react";

import { useBreadcrumbs } from "@/features/breadcrumb";
import { PlatformArea } from "@/shared/config";
import { TwinClassFieldsTable } from "@/widgets/tables";

export function TwinClassFieldsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Fields", href: `/${PlatformArea.core}/fields` }]);
  }, [setBreadcrumbs]);

  return <TwinClassFieldsTable />;
}
