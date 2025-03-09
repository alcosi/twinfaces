export type ProductFlavorConfig = {
  flavor: "twinfaces" | "onshelves";
  productName: string;
  productTitle: string;
  productDescription: string;
  favicon: string;
  loginPage: {
    defaultFormValues: {
      userId: string;
      businessAccountId: string | undefined;
      domainId: string;
    };
  };
};
