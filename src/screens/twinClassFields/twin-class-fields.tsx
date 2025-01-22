import { TwinClassFieldsTable } from "@/widgets/tables";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { useEffect } from "react";

export function TwinClassFieldsScreen() {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Fields", href: "/workspace/fields" }]);
  }, [setBreadcrumbs]);

  return <TwinClassFieldsTable />;
}
