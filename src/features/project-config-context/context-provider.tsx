"use client";

import { ReactNode, createContext, useContext } from "react";

import type { ProjectConfig } from "@/shared/config";

const ProjectConfigContext = createContext<ProjectConfig | null>(null);

export function useProjectConfig() {
  const config = useContext(ProjectConfigContext);

  return config;
}

export function ProjectConfigProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: ProjectConfig;
}) {
  return (
    <ProjectConfigContext.Provider value={config}>
      {children}
    </ProjectConfigContext.Provider>
  );
}
