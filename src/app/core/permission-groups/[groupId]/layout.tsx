import { ReactNode } from "react";

import { PermissionGroupContextProvider } from "@/features/permission-group";

type Props = {
  params: {
    groupId: string;
  };
  children: ReactNode;
};

export default function Layout({ params: { groupId }, children }: Props) {
  return (
    <PermissionGroupContextProvider groupId={groupId}>
      {children}
    </PermissionGroupContextProvider>
  );
}
