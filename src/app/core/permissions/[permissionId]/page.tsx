import { use } from "react";

import { PermissionContextProvider } from "@/features/permission";
import { PermissionScreen } from "@/screens/permission";

type Props = {
  params: Promise<{
    permissionId: string;
  }>;
};

export default function Page({ params }: Props) {
  const { permissionId } = use(params);

  return (
    <PermissionContextProvider permissionId={permissionId}>
      <PermissionScreen />
    </PermissionContextProvider>
  );
}
