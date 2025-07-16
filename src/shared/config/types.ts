import { components } from "@/shared/api/generated/schema";

export type RemoteConfig = components["schemas"]["DomainViewPublicV1"];

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
