"use client";

import { ReactNode, use } from "react";

import { ProjectionContextProvider } from "@/features/projection";

type ProjectionLayoutProps = {
  params: Promise<{
    projectionId: string;
  }>;
  children: ReactNode;
};

export default function ProjectionLayout(props: ProjectionLayoutProps) {
  const params = use(props.params);

  const { projectionId } = params;

  const { children } = props;

  return (
    <ProjectionContextProvider projectionId={projectionId}>
      {children}
    </ProjectionContextProvider>
  );
}
