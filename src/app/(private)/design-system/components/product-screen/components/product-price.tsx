type ProductPriceProps = {
  price: string;
};

export const ProductPrice = ({ price }: ProductPriceProps) => {
  return (
    <>
      <h2 className="sr-only">Product information</h2>
      <p className="dark:text-primary text-3xl tracking-tight">{price}</p>
    </>
  );
};
