export type ProductFlavorConfig = {
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
