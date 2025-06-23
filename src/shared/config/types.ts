import { components } from "@/shared/api/generated/schema";

//TODO remove name?: string; by updating schema
export type RemoteConfig = components["schemas"]["DomainViewPublicV1"] & {
  name?: string;
};

export type ThemeConfig = {
  defaultTheme: "light" | "dark" | "system";
};

export type LocalConfig = {
  productName: string;
  favicon: string;
  loginPage: {
    defaultFormValues: {
      userId: string;
      businessAccountId: string | undefined;
    };
  };
  theme: ThemeConfig;
};

export type ProductFlavorConfig = LocalConfig & RemoteConfig;
