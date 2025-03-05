"use client";

import { ReactNode, createContext, useContext } from "react";

import { ProjectConfig, projectConfig } from "@/shared/config";

type ProjectConfigContextProps = {
  config: ProjectConfig;
};

const ProjectConfigContext = createContext<ProjectConfigContextProps>({
  config: projectConfig,
});

export function ProjectConfigProvider({ children }: { children: ReactNode }) {
  return (
    <ProjectConfigContext.Provider value={{ config: projectConfig }}>
      {children}
    </ProjectConfigContext.Provider>
  );
}

export function useProjectConfig() {
  const config = useContext(ProjectConfigContext);

  return config;
}
