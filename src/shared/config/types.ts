import { components } from "@/shared/api/generated/schema";

export type RemoteConfig = components["schemas"]["DomainViewPublicV1"];

export type LocalConfig = {
  // flavor: "twinfaces",
  // productTitle: "Twin Faces",
  // productDescription: "Admin panel for the Twins framework",
  productName: string;
  favicon: string;
  loginPage: {
    defaultFormValues: {
      userId: string;
      businessAccountId: string | undefined;
      // domainId: string;
    };
  };
};

export type ProductFlavorConfig = LocalConfig & RemoteConfig;
