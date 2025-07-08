type ProductNameProps = {
  name: string;
};

export const ProductName = ({ name }: ProductNameProps) => {
  return (
    <div className="lg:col-span-2 lg:pr-8">
      <h1 className="dark:text-primary text-2xl font-bold tracking-tight sm:text-3xl">
        {name}
      </h1>
    </div>
  );
};
