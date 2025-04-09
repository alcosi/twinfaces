type ProductPriceProps = {
  price: string;
};

export const ProductPrice = ({ price }: ProductPriceProps) => {
  return (
    <>
      <h2 className="sr-only">Product information</h2>
      <p className="text-3xl tracking-tight dark:text-primary">{price}</p>
    </>
  );
};
