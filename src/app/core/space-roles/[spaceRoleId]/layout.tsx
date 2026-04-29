"use client";

import { ReactNode, use } from "react";

import { SpaceRoleContextProvider } from "@/features/space-role";

type SpaceRoleLayoutProps = {
  params: Promise<{
    spaceRoleId: string;
  }>;
  children: ReactNode;
};

export default function SpaceRoleLayout(props: SpaceRoleLayoutProps) {
  const params = use(props.params);

  const { spaceRoleId } = params;

  const { children } = props;

  return (
    <SpaceRoleContextProvider spaceRoleId={spaceRoleId}>
      {children}
    </SpaceRoleContextProvider>
  );
}
