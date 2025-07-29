import { ReactNode } from "react";

import { PermissionGroupContextProvider } from "@/features/permission-group";

type Props = {
  params: Promise<{
    groupId: string;
  }>;
  children: ReactNode;
};

export default async function Layout(props: Props) {
  const params = await props.params;

  const { groupId } = params;

  const { children } = props;

  return (
    <PermissionGroupContextProvider groupId={groupId}>
      {children}
    </PermissionGroupContextProvider>
  );
}
