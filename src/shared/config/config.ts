import {
  LocalConfig,
  ProductFlavorConfig,
  RemoteConfig,
  ThemeConfig,
} from "./types";

const theme: ThemeConfig = {
  defaultTheme: "system",
};

const localConfig: LocalConfig = {
  productName: "TwinFaces",
  favicon: "/favicon.png",
  loginPage: {
    defaultFormValues: {
      userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      businessAccountId: undefined,
    },
  },
  theme,
};

export function getProductFlavorConfig(
  remoteConfig?: RemoteConfig
): ProductFlavorConfig {
  return {
    ...localConfig,
    ...remoteConfig,
  };
}
