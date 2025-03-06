import { ProductFlavorConfig } from "./types";

const configs: Record<string, ProductFlavorConfig> = {
  twinfaces: {
    flavor: "twinfaces",
    productName: "Twin Faces",
    productTitle: "Twin Faces",
    productDescription: "Admin panel for the Twins framework",
    favicon: "/twinfaces/favicon.png",
    loginPage: {
      defaultFormValues: {
        userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
        businessAccountId: undefined,
        domainId: "f67ad556-dd27-4871-9a00-16fb0e8a4102",
      },
    },
  },
  onshelves: {
    flavor: "onshelves",
    productName: "On Shelves",
    productTitle: "On Shelves",
    productDescription: `The On Shelves space serves as a centralized hub for
      managing and documenting. It provides structured guidelines,
      technical documentation, and workflows to ensure seamless
      collaboration between stakeholders, enabling efficient onboarding,
      operation, and scaling of marketplace activities.`,
    favicon: "/onshelves/favicon.png",
    loginPage: {
      defaultFormValues: {
        userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
        businessAccountId: "9a3f6075-f175-41cd-a804-934201ec969c",
        domainId: "d64da887-3e8c-44d5-b067-0b35b16860c2",
      },
    },
  },
};

export const PRODUCT_FLAVOR_CONFIG = configs[
  process.env.PRODUCT_FLAVOR || "twinfaces"
] as ProductFlavorConfig;
