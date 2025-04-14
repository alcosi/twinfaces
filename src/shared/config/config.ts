import {
  LocalConfig,
  ProductFlavorConfig,
  RemoteConfig,
  ThemeConfig,
} from "./types";

const theme: ThemeConfig = {
  defaultTheme: "system",
};

const configs: Record<string, LocalConfig> = {
  twinfaces: {
    productName: "TwinFaces",
    favicon: "/favicon.png",
    loginPage: {
      defaultFormValues: {
        userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
        businessAccountId: undefined,
      },
    },
    theme,
  },
  onshelves: {
    productName: "TwinFaces",
    favicon: "/favicon.png",
    loginPage: {
      defaultFormValues: {
        userId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
        businessAccountId: "9a3f6075-f175-41cd-a804-934201ec969c",
      },
    },
    theme,
  },
};

export function getProductFlavorConfig(
  remoteConfig?: RemoteConfig
): ProductFlavorConfig {
  const key = remoteConfig?.key ?? "twinfaces";
  const localConfig = configs[key] ?? configs["twinfaces"]!;

  return {
    ...localConfig,
    ...remoteConfig,
  };
}
