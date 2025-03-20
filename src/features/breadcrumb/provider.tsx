import { PropsWithChildren, useState } from "react";

import { BreadcrumbContext } from "./context";
import { Breadcrumb } from "./types";

export function BreadcrumbProvider(props: PropsWithChildren<{}>) {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {props.children}
    </BreadcrumbContext.Provider>
  );
}
