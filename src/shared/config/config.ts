export type ProjectConfig = {
  name: string;
  title: string;
  favicon: string;
  description: string;
  defaultFormValues: {
    userId: string;
    businessAccountId: string | undefined;
    domainId: string;
  };
};

const configs: Record<string, ProjectConfig> = {
  twinfaces: {
    name: "Twin Faces",
    title: "Twin Faces",
    favicon: "/twinfaces/favicon.png",
    description: "Admin panel for the Twins framework",
    defaultFormValues: {
      userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      businessAccountId: undefined,
      domainId: "f67ad556-dd27-4871-9a00-16fb0e8a4102",
    },
  },
  onshelves: {
    name: "On Shelves",
    title: "On Shelves",
    favicon: "/onshelves/favicon.png",
    description: `The On Shelves space serves as a centralized hub for
      managing and documenting. It provides structured guidelines,
      technical documentation, and workflows to ensure seamless
      collaboration between stakeholders, enabling efficient onboarding,
      operation, and scaling of marketplace activities.`,
    defaultFormValues: {
      userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      businessAccountId: undefined,
      domainId: "d64da887-3e8c-44d5-b067-0b35b16860c2",
    },
  },
};

export function getServerProjectConfig(): ProjectConfig {
  const activeFlavor = process.env.PRODUCT_FLAVOR || "twinfaces";

  return (configs[activeFlavor] ?? configs["twinfaces"]) as ProjectConfig;
}
